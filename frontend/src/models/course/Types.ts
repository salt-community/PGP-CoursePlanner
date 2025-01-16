export type CourseModuleType = {
  courseId?: number;
  moduleId?: number;
  course?: CourseType;
  module: ModuleType;
}

export type EventType = {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
  isApplied?: boolean;
}

export type DayType = {
  id: number;
  dayNumber: number;
  description?: string;
  isApplied: boolean;
  events: EventType[];
  date: Date;
}

export type ModuleType = {
  id: number;
  name: string;
  numberOfDays: number;
  track: string[];
  order: number;
  isApplied: boolean;
  days: DayType[];
  courseModules?: CourseModuleType[];
  startDate: Date
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
}

export type Track = {
  id?: number;
  color: string;
  name: string;
}

export type CourseProps = {
  course: CourseType;
  buttonText: string;
}

  export type CalendarDateType = {
      id?: number;
      date: Date;
      dateContent: DateContent[];
  }
  
  export type DateContent = {
      appliedCourseId?: number;
      id?: number;
      moduleName?: string;
      moduleId : number;
      dayOfModule: number;
      totalDaysInModule: number;
      courseName: string;
      events: EventType[];
      color: string
  }

