import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonSchedule, CommonScheduleDocument } from './schemas/schedule.schema';

@Injectable()
export class AppService {
  date: Date;
  constructor(  @InjectModel(CommonSchedule.name) private scheduleModel: Model<CommonScheduleDocument>) {
    this.date = new Date(0);
  }
  getHello(): string {
    return 'Hello World!';
  }

  async getUser(): Promise<any> {
    const result = await this.scheduleModel.find().lean();
    return result;
  }

  changeCurrentDate() {
    this.date = new Date();
  }

  getDate(): Date {
    return this.date;
  }
}
