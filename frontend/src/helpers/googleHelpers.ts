import { addDays, addHours, addMinutes, startOfDay } from "date-fns";
import { postCourseToGoogle } from "../api/googleCalendar/googleCalendarFetches";
import { ModuleType } from "../models/module/Types";

interface Attendee {
  email: string; // Email of the guest
  displayName?: string; // Optional name for the guest
  optional?: boolean; // Indicates if the guest’s attendance is optional
  responseStatus?: "accepted" | "declined" | "tentative" | "needsAction";
}


export type GoogleEvent = {
  attendees: Attendee[];
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

export function convertToGoogleDate(
  date: Date,
  eventTime: string,
  dayIndex: number
) {
  date = startOfDay(date);
  date = addDays(date, dayIndex);

  const [hoursString, minutesString] = eventTime.split(":");
  const hours = parseInt(hoursString, 10);
  const minutes = parseInt(minutesString, 10);

  date = addHours(date, hours);
  date = addMinutes(date, minutes);

  return date;
}

export const convertToGoogle = (
  modules: ModuleType[],
  templateStart: Date,
  courseName: string,
  groupEmail: string,
) => {
  const googleEvents: GoogleEvent[] = [];

  let fridayIndex = 4;
  let dayIndex = 0;
  modules.forEach((module) => {
    module.days.forEach((day) => {
      day.events.forEach((event) => {
        const startDate = convertToGoogleDate(
          templateStart,
          event.startTime,
          dayIndex
        );
        const endDate = convertToGoogleDate(
          templateStart,
          event.endTime,
          dayIndex
        );

        const googleEvent: GoogleEvent = {
          attendees: [{email: groupEmail}],
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
      if (dayIndex === 4 || dayIndex === fridayIndex) {
        fridayIndex += 7;
        dayIndex += 3;
      } else {
        dayIndex += 1;
      }
    });
  });
  postCourseToGoogle(googleEvents);
};
