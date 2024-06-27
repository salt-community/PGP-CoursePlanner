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

export const month = format(new Date(), "MMMM");
export const today = formatDate(new Date());
export const currentYear = getYear(new Date());
export const currentMonth = getMonth(new Date());
export const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
export const lastDayOfMonth = endOfMonth(new Date());
export const firstWeekDay = parseInt(format(firstDayOfMonth, "i")) - 1;

export const daysBeforeMonth = eachDayOfInterval({
  start: firstDayOfMonth,
  end: addDays(firstDayOfMonth, firstWeekDay),
});

export const allDaysInMonth = eachDayOfInterval({
  start: firstDayOfMonth,
  end: lastDayOfMonth,
});

export const weekDays = eachDayOfInterval({
  start: firstDayOfWeek,
  end: addDays(firstDayOfWeek, 4),
});

export const fullWeek = eachDayOfInterval({
  start: firstDayOfWeek,
  end: addDays(firstDayOfWeek, 6),
});
