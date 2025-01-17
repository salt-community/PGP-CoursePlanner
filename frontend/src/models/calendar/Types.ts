import { EventType } from "@models/module/Types";
import { Track } from "@models/course/Types";

export type CalendarDateType = {
    id?: number;
    date: Date;
    dateContent: DateContent[];
}

export type DateContent = {
    appliedCourseId?: number;
    id?: number;
    track: Track;
    moduleName?: string;
    dayOfModule: number;
    totalDaysInModule: number;
    courseName: string;
    events: EventType[];
    color: string
}