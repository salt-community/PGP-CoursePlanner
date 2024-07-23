import { addDays, addHours, addMinutes, startOfDay } from "date-fns";
import { postCourseToGoogle } from "../api/GoogleCalendarApi";
import { ModuleType } from "../models/module/Types";

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

export function converToGoogleDate(
  date: Date,
  eventTime: string,
  daysToAdd: number
) {
  date = startOfDay(date);
  date = addDays(date, daysToAdd);

  const [hoursString, minutesString] = eventTime.split(":");
  const hours = parseInt(hoursString, 10);
  const minutes = parseInt(minutesString, 10);

  date = addHours(date, hours + 2);
  date = addMinutes(date, minutes);

  return date;
}

export const convertToGoogle = (
  modules: ModuleType[],
  templateStart: Date,
  courseName: string
) => {
  const googleEvents: GoogleEvent[] = [];
  let daysToAdd = 0;

  modules.forEach((module) => {
    module.days.forEach((day) => {
      day.events.forEach((event) => {
        const startDate = converToGoogleDate(
          templateStart,
          event.startTime,
          daysToAdd
        );
        const endDate = converToGoogleDate(
          templateStart,
          event.endTime,
          daysToAdd
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
      daysToAdd += 1;
    });
  });
  postCourseToGoogle(googleEvents);
};
