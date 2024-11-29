import { DayType, EventType, ModuleType } from "../module/Types";

export type AppliedModuleProps = {
  submitFunction: (index: number, module: ModuleType) => Promise<void>;
  module: ModuleType;
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
