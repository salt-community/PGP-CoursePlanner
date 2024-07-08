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

export const formatDate = (date: Date) => {
  return format(date, "MM/dd/yyyy");
};

export const today = formatDate(new Date());
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
  if(daysToAdd == 1){
    return []
  }

  return eachDayOfInterval({
    start: startDate,
    end: addDays(startDate, daysToAdd -2),
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

export const fullWeek = eachDayOfInterval({
  start: firstDayOfWeek,
  end: addDays(firstDayOfWeek, 6),
});

export function getWeekNumber(date: Date): number {
  // Copying date so the original date won't be modified
  const tempDate = new Date(date.valueOf());

  // ISO week date weeks start on Monday, so correct the day number
  const dayNum = (date.getDay() + 6) % 7;

  // Set the target to the nearest Thursday (current date + 4 - current day number)
  tempDate.setDate(tempDate.getDate() - dayNum + 3);

  // ISO 8601 week number of the year for this date
  const firstThursday = tempDate.valueOf();

  // Set the target to the first day of the year
  // First set the target to January 1st
  tempDate.setMonth(0, 1);

  // If this is not a Thursday, set the target to the next Thursday
  if (tempDate.getDay() !== 4) {
      tempDate.setMonth(0, 1 + ((4 - tempDate.getDay()) + 7) % 7);
  }

  // The weeknumber is the number of weeks between the first Thursday of the year
  // and the Thursday in the target week
  return 1 + Math.ceil((firstThursday - tempDate.valueOf()) / 604800000); // 604800000 = number of milliseconds in a week
}