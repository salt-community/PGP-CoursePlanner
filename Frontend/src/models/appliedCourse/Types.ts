import { AppliedCourseType, CourseModule } from "../course/Types";


export type AppliedModuleType = {
  id?: number;
  name: string;
  numberOfDays: number;
  days: AppliedDayType[];
  courseModules?: CourseModule[];
};

export type AppliedModuleProps = {
  submitFunction: (index: number, module: AppliedModuleType) => Promise<void>;
  module: AppliedModuleType;
  index: number;
  buttonText: string;
};

export type AppliedDayType = {
  id?: number;
  dayNumber: number;
  description: string;
  events: AppliedEventType[];
};

export type AppliedDayProps = {
  day: AppliedDayType;
  setDays: React.Dispatch<React.SetStateAction<AppliedDayType[]>>;
  days: AppliedDayType[];
  setNumOfDays: React.Dispatch<React.SetStateAction<number>>
};

export type AppliedEventType = {
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
  links?: string[];
};

export type EventProps = {
  setDays: React.Dispatch<React.SetStateAction<AppliedDayType[]>>;
  days: AppliedDayType[];
  index: number;
  dayNumber: number;
  event: AppliedEventType;
};
