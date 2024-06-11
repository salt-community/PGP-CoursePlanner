import { DayType } from "../day/Types";

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
