import { FormEvent } from "react";
import { DayType } from "../day/Types";

export type ModuleType = {
  id?: number;
  name: string;
  numberOfDays: number;
  days: DayType[];
};

export type ModuleProps = {
  submitFunction: (module: ModuleType) => Promise<void>;
  module: ModuleType;
}
