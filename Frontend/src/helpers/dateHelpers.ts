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
