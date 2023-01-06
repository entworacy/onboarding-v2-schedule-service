import { Controller, Get, Inject } from '@nestjs/common';
import { KafkaService } from '@rob3000/nestjs-kafka/dist/kafka.service';
import { AppService } from './app.service';
import { InjectModel } from '@nestjs/mongoose';
import { CommonSchedule, CommonScheduleDocument } from './schemas/schedule.schema';
import { Model } from 'mongoose';

@Controller("/api/v2/")
export class AppController {
  constructor(private readonly appService: AppService,
    @Inject("kakfaClient") private readonly client: KafkaService) {}

  @Get("/get-schedule")
  async getSchedule() {
    return {
      lastUpdated: this.appService.getDate(),
      list: await this.appService.getUser()
    };
  }

  @Get("/requestReloadSchedule")
  async reloadSchedule() {
    try {
      const differenceMs = new Date().getTime() - this.appService.getDate().getTime();
      const differenceHours =
        Math.floor(
          Math.floor(differenceMs / 1000) / 60
        );

        
      
      
      console.log(new Date());
      console.log(differenceHours);
      
      

      if(differenceHours < 60) {
        throw new Error("갱신은 최근 갱신시점으로부터 1시간이 지난 후 가능합니다.\n마지막 갱신: " + this.appService.getDate().toLocaleString());
      }
      await this.client.send({
        topic: "run-collect-events",
        messages: [
          {
            key: "1",
            value: JSON.stringify({
              action: "ACTION_COLLECT_SCHEDULE"
            })
          }
        ]
      });
  
      return {
        resultCode: "SUCCESS"
      }
    } catch(e: Error | any) {
      return {
        resultCode: "ERROR",
        error: {
          e: true,
          message: (e as Error).message
        }
      }
    }
  }
}
