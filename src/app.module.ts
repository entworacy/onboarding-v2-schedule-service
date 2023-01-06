import { Inject, Module } from '@nestjs/common';
import { IHeaders } from '@nestjs/microservices/external/kafka.interface';
import { MongooseModule, InjectModel } from '@nestjs/mongoose';
import { KafkaModule, KafkaService, SubscribeTo } from '@rob3000/nestjs-kafka';
import { Model } from 'mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonSchedule, CommonScheduleDocument, ScheduleSchema } from './schemas/schedule.schema';

@Module({
  imports: [
    KafkaModule.register([
      {
        name: "kakfaClient",
        options: {
          client: {
            clientId: "onboarding-v2-schedule-service",
            brokers: ["localhost:9092"]
          },
          consumer: {
            groupId: "schedule-service"
          }
        }
      }
    ]),
    MongooseModule.forRoot("mongodb://127.0.0.1:27017"),
    MongooseModule.forFeature([
      {
        name: CommonSchedule.name,  schema: ScheduleSchema
      }
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {


  constructor(@Inject("kakfaClient") private client: KafkaService, 
    @InjectModel(CommonSchedule.name) private scheduleModel: Model<CommonScheduleDocument>, private appService: AppService) {}
  onModuleInit(): void {
    console.log("init");
    this.client.subscribeToResponseOf("response-collect-events", this);
  }

  @SubscribeTo("response-collect-events")
  async response(data: any, key: any, offset: number, timestamp: number, partition: number, headers: IHeaders): Promise<void> {
    console.log("hi");
    console.log(JSON.parse(data as string) );

    await this.scheduleModel.deleteMany();
    let data2 = JSON.parse(data as string);

    let first: CommonSchedule[] = data2.data.base.first;
    let second: CommonSchedule[] = data2.data.base.second;
    for(const f of first) {
      let element = new this.scheduleModel(f);
      await element.save();
    }

    for(const s of second) {
      let element = new this.scheduleModel(s);
      await element.save();
    }

    this.appService.changeCurrentDate();
  }
}
