import { CourseModule } from "../course/Types";


export type ModuleType = {
  id?: number;
  name: string;
  numberOfDays: number;
  days: DayType[];
  courseModules?: CourseModule[];
};

export type ModuleProps = {
  submitFunction: (module: ModuleType) => Promise<void>;
  module: ModuleType;
  buttonText: string;
};

export type DayType = {
  id?: number;
  dayNumber: number;
  description: string;
  events: EventType[];
};

export type DayProps = {
  moduleIndex: number;
  day: DayType;
  setDays: React.Dispatch<React.SetStateAction<DayType[]>>;
  days: DayType[];
  setNumOfDays: React.Dispatch<React.SetStateAction<number>>
};

export type EventType = {
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
  links?: string[];
};

export type EventProps = {
  setDays: React.Dispatch<React.SetStateAction<DayType[]>>;
  days: DayType[];
  index: number;
  dayNumber: number;
  event: EventType;
};
