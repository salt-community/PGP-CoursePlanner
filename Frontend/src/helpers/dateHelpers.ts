import { addDays, eachDayOfInterval, format, startOfWeek } from "date-fns";

export const firstDayOfWeek = startOfWeek(new Date());

export const formatDate = (date: Date) => {
    return format(date, 'MM/dd/yyyy')
}

export const today = formatDate(new Date());

export const weekDays  = eachDayOfInterval({
    start: firstDayOfWeek,
    end: addDays(firstDayOfWeek, 6)
  })