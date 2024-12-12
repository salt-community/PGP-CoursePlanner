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
  }
  
  export type ModuleType = {
    id: number;
    name: string;
    numberOfDays: number;
    track: string[];
    order: number;
    isApplied: boolean;
    days: DayType[]; 
   
    courseId?: number;  
    moduleId?: number; 
    module?: {
      id: number;
      name: string;
      track: string[];
      order: number;
      isApplied: boolean;
      numberOfDays: number;
      days: DayType[];
    }; 
  }
  
  export type CourseType = {
    id?: number;
    name: string;
    startDate: Date;
    endDate?: Date;
    numberOfWeeks?: number;
    moduleIds?: number[]; 
    color?: string;
    isApplied?: boolean;
    modules: ModuleType[]; 
  }
  
  export type CourseProps = {
    course: CourseType;
    buttonText: string;
  }
  