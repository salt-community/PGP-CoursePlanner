export type ModuleType = {
  id: number;
  name: string;
  numberOfDays: number;
  days: DayType[];
  track: string[];
  order: number;
  isApplied: boolean;
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
  editTrue: boolean;
  moduleId: number;
  day: DayType;
  setDays: React.Dispatch<React.SetStateAction<DayType[]>>;
  days: DayType[];
  setNumOfDays: React.Dispatch<React.SetStateAction<number>>;
};

export type EventType = {
  id?: number;
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
};

export type EventProps = {
  appliedTrue: boolean;
  editTrue: boolean;
  moduleId: number;
  setDays: React.Dispatch<React.SetStateAction<DayType[]>>;
  days: DayType[];
  index: number;
  dayNumber: number;
  event: EventType;
};
