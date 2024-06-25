import { addDays, eachDayOfInterval, format, startOfWeek } from "date-fns";

export const firstDayOfWeek = startOfWeek(new Date());

export const today = parseInt(format(new Date(), 'd'));

export const weekDays  = eachDayOfInterval({
    start: firstDayOfWeek,
    end: addDays(firstDayOfWeek, 6)
  })