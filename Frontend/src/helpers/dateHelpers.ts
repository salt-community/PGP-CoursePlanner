import {
  addDays,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  format,
  getMonth,
  getWeek,
  getYear,
  startOfWeek,
  startOfYear,
} from "date-fns";

export const firstDayOfWeek = startOfWeek(new Date(), { weekStartsOn: 1 });

var thisWeek = new Date();
const nextWeek = new Date(thisWeek);
nextWeek.setDate(thisWeek.getDate() + 7)
export const firstDayOfNextWeek = startOfWeek(nextWeek, { weekStartsOn: 1 });

// export const firstDayOfWeekNumber = (weekNumber: number, year: number) => {
//   const firstDayOfYear = startOfYear(new Date(year, 0, 1));
//   const dateOfWeek = addWeeks(firstDayOfYear, weekNumber - 1);
//   return startOfWeek(dateOfWeek, { weekStartsOn: 1 });
// };

export const firstDayOfWeekNumber = (weekNumber: number, year: number) => {
  // Start by finding the 4th of January of the given year
  const january4th = new Date(year, 0, 4);

  // Calculate the first day of the first week (ISO week starts on Monday)
  const firstWeekStart = startOfWeek(january4th, { weekStartsOn: 1 });

  // Calculate the desired week by adding (weekNumber - 1) weeks
  return addWeeks(firstWeekStart, weekNumber - 1);
};

export const getDateAsString = (date: Date) => {
  return format(date, "MM/dd/yyyy");
};

export const today = getDateAsString(new Date());
export const currentYear = getYear(new Date());
export const currentMonth = getMonth(new Date());
export const currentWeek = getWeek(new Date());

export const firstDayOfMonth = (month: number, year: number) => {
  return new Date(year, month, 1);
};

export const lastDayOfMonth = (month: number, year: number) => {
  return endOfMonth(new Date(year, month, 1));
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

export const allDaysInInterval = (startDate: Date, endDate: Date) => {
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

export const fullWeekOfWeekNumber = (weekNumber: number, yearNumber: number) => {
  return eachDayOfInterval({
    start: firstDayOfWeekNumber(weekNumber, yearNumber),
    end: addDays(firstDayOfWeekNumber(weekNumber, yearNumber), 6),
  });
};

export const fullWeek = eachDayOfInterval({
  start: firstDayOfWeek,
  end: addDays(firstDayOfWeek, 6),
});

export function daysBetweenDates(date1: Date, date2: Date): number {
  var diff = Math.abs(date1.getTime() - date2.getTime());
  var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
  return diffDays;
}