import { EventType } from "@models/course/Types";
import { Track } from "@models/course/Types";

export type CalendarDateType = {
    id?: number;
    date: Date;
    dateContent: DateContent[];
}

export type DateContent = {
    moduleId: number;
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