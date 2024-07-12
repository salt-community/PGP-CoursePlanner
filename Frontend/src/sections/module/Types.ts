import { CourseModule } from "../course/Types";
import { DayType } from "../day/Types";

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
