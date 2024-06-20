import { EventType } from "../event/Types";

export type DayType = {
  id?: number;
  dayNumber: number;
  description: string;
  events: EventType[];
};

export type DayProps = {
  day: DayType;
  setDays: React.Dispatch<React.SetStateAction<DayType[]>>;
  days: DayType[];
};
