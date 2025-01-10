
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
}

export type CourseType = {
  id?: number;
  name: string;
  track?: string;
  startDate: Date;
  endDate?: Date;
  numberOfWeeks?: number;
  moduleIds?: number[]; 
  color?: string;
  isApplied?: boolean;
  modules: CourseModuleType[]; 
}

  
  export type CourseProps = {
    course: CourseType;
    buttonText: string;
  }
  