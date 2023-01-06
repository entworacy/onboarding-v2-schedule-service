import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

export type CommonScheduleDocument = CommonSchedule & Document;

@Schema()
export class CommonSchedule {
    @Prop()
    version: string;
    @Prop()
    isLive?: boolean;
    @Prop()
    scheduleStartDate: string;
    @Prop()
    schedulePlatformType: number;
    @Prop()
    scheduleUrl: string;
    @Prop()
    scheduleTitle: string;
    @Prop()
    scheduleAuthorName: string;
    @Prop()
    scheduleThumbnailUrl: string;
    @Prop()
    scheduleAuthorProfileUrl: string;
    @Prop()
    scheduleDescription?: string;
    @Prop()
    hasCollaborator: boolean;

    @Prop()
    attachment: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(CommonSchedule);