import { EventType } from "../event/Types";

export type DayType = {
  dayNumber: number;
  description: string;
  events: EventType[];
};

export type DayProps = {
  day: DayType;
  events: EventType[];
  setDays: React.Dispatch<React.SetStateAction<DayType[]>>;
  days: DayType[];
};
