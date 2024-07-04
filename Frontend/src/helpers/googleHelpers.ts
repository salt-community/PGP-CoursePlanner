import { addDays, addHours, addMinutes, startOfDay } from "date-fns";
import { DayType } from "../sections/day/Types";
import { CourseModule } from "../sections/course/Types";
import { useQuery } from "react-query";
import { getAllModules, getModuleById } from "../api/ModuleApi";
import { ModuleType } from "../sections/module/Types";

export type GoogleEvent = {
  summary: string;
  location?: string;
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
      template: string;
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
  console.log("start of course: ", date);

  const daysToAdd = moduleNumber + dayNumber;
  console.log("days to add: ", daysToAdd);

  date = addDays(date, daysToAdd);
  console.log("date after adding days: ", date);

  const [hoursString, minutesString] = eventTime.split(":");
  console.log("Hours of start time: ", hoursString);
  console.log("Minutes of start time: ", minutesString);

  const hours = parseInt(hoursString, 10);
  console.log("hours after parsing with base 10: ", hours);

  const minutes = parseInt(minutesString, 10);
  console.log("minutes after parsing with base 10: ", minutes);

  date = addHours(date, hours + 2);
  console.log("Date after adding hours: ", date);

  date = addMinutes(date, minutes);
  console.log("Date after adding minutes: ", date);

  console.log("date after adding time: ", date);
  return date;
}

export const convertToGoogle = (modules: ModuleType[], templateStart: Date) => {
  const googleEvents: GoogleEvent[] = [];

  // const modules: ModuleType[] = courseModules.map((courseModule) =>
  //   getModule(courseModule.moduleId!)
  // );

  // const getModule = (moduleId: number) => {
  //   const { data } = useQuery({
  //     queryKey: ["modules"],
  //     queryFn: () => getModuleById(moduleId!),
  //   });

  //   return data ?? null!;
  // };

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
          location: event.description,
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
              template: "sprint",
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
