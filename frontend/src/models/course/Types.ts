export type CourseModuleType = {
  courseId?: number;
  moduleId?: number;
  course?: CourseType;
  module: ModuleType;
}

export type CourseType = {
  id?: number;
  track: Track;
  name: string;
  startDate: Date;
  endDate?: Date;
  numberOfWeeks?: number;
  moduleIds?: number[];
  color?: string;
  isApplied?: boolean;
  modules: CourseModuleType[];
  miscellaneousEvents: EventType[];
}

export type Track = {
  id?: number;
  color: string;
  name: string;
  visibility: boolean;
}

export type CourseProps = {
  course: CourseType;
  buttonText: string;
}

export type ModuleType = {
id?: number;
name: string;
numberOfDays: number;
days: DayType[];
tracks: Track[];
order?: number;
isApplied?: boolean;
startDate?: Date
};

export type ModuleProps = {
module: ModuleType;
buttonText: string;
};

export type DayType = {
id?: number;
dayNumber: number;
description: string;
events: EventType[];
isApplied?: boolean;
date: string;
};

export type DayProps = {
editTrue: boolean;
moduleId: number;
day: DayType;
setDays: React.Dispatch<React.SetStateAction<DayType[]>>;
days: DayType[];
setNumOfDays: React.Dispatch<React.SetStateAction<number>>;
};

export type EventType = {
id?: number;
name: string;
startTime: string;
endTime: string;
description?: string;
isApplied?: boolean;
};

export type EventProps = {
appliedTrue: boolean;
editTrue: boolean;
moduleId: number;
setDays: React.Dispatch<React.SetStateAction<DayType[]>>;
days: DayType[];
index: number;
dayNumber: number;
event: EventType;
};