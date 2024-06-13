import { FormEvent } from "react";
import { DayType } from "../day/Types";

export type ModuleType = {
  id?: number;
  name: string;
  numberOfDays: number;
  days: DayType[];
};

export type ModuleProps = {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  module: ModuleType;
}
