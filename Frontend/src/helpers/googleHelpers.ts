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
  const daysToAdd = moduleNumber + dayNumber;
  date = addDays(date, daysToAdd);

  const [hoursString, minutesString] = eventTime.split(":");
  const hours = parseInt(hoursString, 10);
  const minutes = parseInt(minutesString, 10);

  date = addHours(date, hours + 2);
  date = addMinutes(date, minutes);

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
