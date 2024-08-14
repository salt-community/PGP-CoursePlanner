import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  getMonth,
  getYear,
  startOfWeek,
} from "date-fns";

export const firstDayOfWeek = startOfWeek(new Date(), { weekStartsOn: 1 });

var thisWeek = new Date();
const nextWeek = new Date(thisWeek);
nextWeek.setDate(thisWeek.getDate() + 7)
export const firstDayOfNextWeek = startOfWeek(nextWeek, { weekStartsOn: 1 });

export const getDateAsString = (date: Date) => {
  return format(date, "MM/dd/yyyy");
};

export const today = getDateAsString(new Date());
export const currentYear = getYear(new Date());
export const currentMonth = getMonth(new Date());

export const firstDayOfMonth = (month: number) => {
  return new Date(currentYear, month, 1);
};

export const lastDayOfMonth = (month: number) => {
  return endOfMonth(new Date(currentYear, month, 1));
};


export const firstWeekDay = (date: Date) => {
  return parseInt(format(date, "i"));
};

export const daysBeforeMonth = (startDate: Date, daysToAdd: number) => {
  if (daysToAdd == 1) {
    return []
  }
  
  return eachDayOfInterval({
    start: startDate,
    end: addDays(startDate, daysToAdd - 2),
  });
};

export const allDaysInMonth = (startDate: Date, endDate: Date) => {
  return eachDayOfInterval({
    start: startDate,
    end: endDate,
  });
};

export const weekDays = eachDayOfInterval({
  start: firstDayOfWeek,
  end: addDays(firstDayOfWeek, 4),
});

export const weekDaysNextWeek = eachDayOfInterval({
  start: firstDayOfNextWeek,
  end: addDays(firstDayOfNextWeek, 4),
});

export const fullWeek = eachDayOfInterval({
  start: firstDayOfWeek,
  end: addDays(firstDayOfWeek, 6),
});

export function daysBetweenDates(date1: Date, date2: Date): number {
  var diff = Math.abs(date1.getTime() - date2.getTime());
  var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
  return diffDays;
}