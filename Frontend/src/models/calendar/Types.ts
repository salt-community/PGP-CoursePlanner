import { EventType } from "../module/Types";

export type CalendarDateType = {
    id?: number;
    date: Date;
    dateContent: DateContent[];
}

export type DateContent = {
    appliedCourseId?: number;
    id?: number;
    moduleName?: string;
    dayOfModule: number;
    totalDaysInModule: number;
    courseName: string;
    events: EventType[];
    color: string
}



  