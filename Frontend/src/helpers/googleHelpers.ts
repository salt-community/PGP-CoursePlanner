import { addDays, addHours, addMinutes, startOfDay } from "date-fns";
import { ModuleType } from "../sections/module/Types";

export type GoogleEvent = {
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  extendedProperties: {
    shared: {
      course: string;
    };
  };
};

export function converToDate(
  date: Date,
  moduleNumber: number,
  eventTime: string,
  dayNumber: number
) {
  date = startOfDay(date);
  const daysToAdd = moduleNumber + dayNumber -1;
  date = addDays(date, daysToAdd);

  const [hoursString, minutesString] = eventTime.split(":");
  const hours = parseInt(hoursString, 10);
  const minutes = parseInt(minutesString, 10);

  date = addHours(date, hours + 2);
  date = addMinutes(date, minutes);

  return date;
}

export const convertToGoogle = (modules: ModuleType[], templateStart: Date, courseName: string) => {
  const googleEvents: GoogleEvent[] = [];

  modules.forEach((module, moduleIndex) => {
    module.days.forEach((day) => {
      day.events.forEach((event) => {
        const startDate = converToDate(
          templateStart,
          moduleIndex,
          event.startTime,
          day.dayNumber
        );
        const endDate = converToDate(
          templateStart,
          moduleIndex,
          event.endTime,
          day.dayNumber
        );

        const googleEvent: GoogleEvent = {
          summary: event.name,
          description: event.description,
          start: {
            dateTime: startDate.toISOString(),
            timeZone: "Europe/Stockholm",
          },
          end: {
            dateTime: endDate.toISOString(),
            timeZone: "Europe/Stockholm",
          },
          extendedProperties: {
            shared: {
              course: courseName,
            },
          },
        };

        googleEvents.push(googleEvent);
      });
    });
  });
  console.log(googleEvents);
  // createCalendarTemplate(googleEvents);
};
