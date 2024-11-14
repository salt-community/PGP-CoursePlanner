import { CourseModule } from "../course/Types";
import { DayType, EventType } from "../module/Types";


export type AppliedModuleType = {
  id?: number;
  name: string;
  numberOfDays: number;
  days: DayType[];
  courseModules?: CourseModule[];
};

export type AppliedModuleProps = {
  submitFunction: (index: number, module: AppliedModuleType) => Promise<void>;
  module: AppliedModuleType;
  index: number;
  buttonText: string;
};

export type AppliedDayProps = {
  moduleIndex: number;
  day: DayType;
  setDays: React.Dispatch<React.SetStateAction<DayType[]>>;
  days: DayType[];
  setNumOfDays: React.Dispatch<React.SetStateAction<number>>
};

export type EventProps = {
  setDays: React.Dispatch<React.SetStateAction<DayType[]>>;
  days: DayType[];
  index: number;
  dayNumber: number;
  event: EventType;
};
