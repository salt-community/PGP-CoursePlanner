export type Track = {
  id?: number;
  color: string;
  name: string;
  visibility: boolean;
  creationDate: Date;
}

export type TrackRequest = {
  color: string;
  name: string;
}

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
  creationDate: Date;
}

export type ModuleType = {
  id?: number;
  name: string;
  numberOfDays: number;
  days: DayType[];
  tracks: Track[];
  order?: number;
  isApplied?: boolean;
  startDate?: Date;
  creationDate: Date;
};

export type DayType = {
  id?: number;
  dayNumber: number;
  description: string;
  events: EventType[];
  isApplied?: boolean;
  date: Date;
};

export type EventType = {
  id?: number;
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
  isApplied?: boolean;
};