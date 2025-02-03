import { GoogleEvent } from "@helpers/googleHelpers";
import { CourseType, DayType, ModuleType } from "../Types";
import { EventType } from "@models/module/Types";
import { CalendarDateType } from "@models/calendar/Types";
import { getDateAsString } from "@helpers/dateHelpers";
import { NavigateFunction } from "react-router-dom";
import { UseMutationResult } from "@tanstack/react-query";
import { getDate } from "date-fns";

export const findDuplicates = (modules: Array<ModuleType>): boolean => {
  return modules.some((module, idx) =>
    modules.slice(idx + 1).some((other) => other.id === module.id)
  );
};

export const isStringInputIncorrect = (str: string): boolean => {
  return str.trim().length === 0;
};

export const numberOfDaysInCourse = (course: CourseType) => {
  let days = 0;
  course.modules.forEach((element) => {
    days += element.module.numberOfDays;
  });
  return days;
};

export const getWeekNumberOfModule = (course: CourseType, moduleId: number) => {
  let weeknumber = 1;
  let nrOfDays = 0;
  const modules = course.modules.map((m) => m.module);
  for (let i = 0; i < modules.length; i++) {
    if (modules[i].id == moduleId) {
      return weeknumber;
    }
    nrOfDays += modules[i].numberOfDays;
    weeknumber = Math.floor(nrOfDays / 5) + 1;
  }
  return 1;
};

export const getCourseDayDates = (course: CourseType, startDate: Date) => {
  const calendarDateTypes: CalendarDateType[] = [];
  const currentDate = new Date(startDate);

  const updatedCourse = { ...course, startDate: new Date(startDate) }; 
  const modules = updatedCourse.modules.map((m) => m.module);

  for (let i = 0; i < modules.length; i++) {
    for (let j = 0; j < modules[i].numberOfDays; j++) {
      // Skip weekends (Saturday: 6, Sunday: 0)
      while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      modules[i].days[j].date = new Date(currentDate);
      updatedCourse.endDate = new Date(currentDate);
      calendarDateTypes.push({
        date: new Date(currentDate),
        dateContent: [
          {
            dayOfModule: modules[i].days[j].dayNumber,
            totalDaysInModule: modules[i].numberOfDays,
            courseName: course.name,
            events: modules[i].days[j].events,
            color: "#999999",
            appliedCourseId: course.id,
            moduleName: modules[i].name,
            moduleId: modules[i].id,
            track: course.track,
          },
        ],
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    modules[i].startDate = modules[i].days[0].date;
  }
  return calendarDateTypes;
};

export const getCourseWithDates = (course: CourseType, startDate: Date) => {
  const currentDate = new Date(startDate);

  const updatedCourse = { ...course, startDate: new Date(startDate) };
  const modules = updatedCourse.modules.map((m) => m.module);

  for (let i = 0; i < modules.length; i++) {
    while (currentDate.getDay() !== 1) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    for (let j = 0; j < modules[i].numberOfDays; j++) {
      // Skip weekends (Saturday: 6, Sunday: 0)
      while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      modules[i].days[j].date = new Date(currentDate);
      updatedCourse.endDate = new Date(currentDate);
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    modules[i].startDate = modules[i].days[0].date;
  }
  return updatedCourse;
};

export const updatePreviewCalendarDates = (course: CourseType) => {
  const calendarDateTypes: CalendarDateType[] = [];
  const modules = course.modules.map((m) => m.module);

  for (let i = 0; i < modules.length; i++) {
    for (let j = 0; j < modules[i].numberOfDays; j++) {
      calendarDateTypes.push({
        date: new Date(modules[i].days[j].date),
        dateContent: [
          {
            dayOfModule: modules[i].days[j].dayNumber,
            totalDaysInModule: modules[i].numberOfDays,
            courseName: course.name,
            events: modules[i].days[j].events,
            color: "#999999",
            appliedCourseId: course.id,
            moduleName: modules[i].name,
            moduleId: modules[i].id,
            track: course.track,
          },
        ],
      });
    }
  }
  return calendarDateTypes;
};

export const getUpdatedCourse = (course: CourseType, startDate: Date) => {
  const updatedCourse = { ...course, startDate: new Date(startDate) };

  updatedCourse.modules = updatedCourse.modules.map((m) => ({
    ...m,
    module: { ...m.module, days: m.module.days.map(day => ({ ...day })) }
  }));

  const modules = updatedCourse.modules.map((m) => m.module);

  for (let i = 0; i < modules.length; i++) {
    let currentDate = new Date(modules[i].startDate);

    for (let j = 0; j < modules[i].numberOfDays; j++) {
      while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate = getNewDate(currentDate, 1);
      }
      modules[i].days[j].date = new Date(currentDate);
      console.log(modules[i].days[j].date)
      updatedCourse.endDate = currentDate;
      currentDate = getNewDate(currentDate, 1);
    }
  }

  return updatedCourse;
};
export const detectOverlappingDays = (course: CourseType): DayType[] => {
  const days = course.modules.flatMap((m) => m.module.days);
  days.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const daysWithOverlap: DayType[] = [];

  for (let i = 0; i < days.length - 1; i++) {
    const currentDay = days[i];
    const nextDay = days[i + 1];

    const currentDayString = getDateAsString(currentDay.date);
    const nextDayString = getDateAsString(nextDay.date);

    if (currentDayString == nextDayString) {
      if (!daysWithOverlap.includes(currentDay)) {
        daysWithOverlap.push(currentDay);
      }
      if (!daysWithOverlap.includes(nextDay)) {
        daysWithOverlap.push(nextDay);
      }
    }
  }

  return daysWithOverlap;
};

export const getDifferenceInDays = (date1: Date, date2: Date) => {
  const date1Ms = new Date(date1).getTime();
  const date2Ms = new Date(date2).getTime();
  const differenceMs = date1Ms - date2Ms;
  return Math.floor(differenceMs / (1000 * 60 * 60 * 24));
};

export const getNewDate = (currentDate: Date, difference: number) => {
  const todayDate = new Date(currentDate);
  todayDate.setDate(todayDate.getDate() + difference);
  return todayDate;
};

export const getCalculatedDays = (days: DayType[], startDate: Date) => {
  const currentDate = new Date(startDate);
  const newDays: DayType[] = deepRemoveId(days);

  for (let i = 0; i < days.length; i++) {
    while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    newDays[i].date = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return newDays;
};

export const moveModule = (module: ModuleType, targetDate: Date) => {
  const newModule: ModuleType = deepRemoveId(module);
  newModule.id = module.id;

  newModule.startDate = new Date(targetDate);
  newModule.days = getCalculatedDays(newModule.days, newModule.startDate);

  return newModule;
};

const formatDateTime = (date: Date, time: string): string => {
  const [hours, minutes] = time.split(":").map(Number); // Extract hours and minutes
  const updatedDate = new Date(date); // Clone the date object to avoid mutation
  updatedDate.setHours(hours, minutes, 0, 0); // Set the time
  return updatedDate.toISOString(); // Convert to ISO 8601 string
};

export const getGoogleEventListForCourse = (
  course: CourseType,
  groupEmail: string
) => {
  const days = course.modules.flatMap((m) => m.module.days);

  const events: GoogleEvent[] = days.flatMap((day) =>
    day.events.map((e: EventType) => {
      return {
        attendees: groupEmail ? [{ email: groupEmail }] : [], // Check if groupEmail is not empty
        summary: course.name + e.name,
        description: e.description,
        start: {
          dateTime: formatDateTime(day.date, e.startTime),
          timeZone: "Europe/Stockholm", // Swedish timezone
        },
        end: {
          dateTime: formatDateTime(day.date, e.endTime),
          timeZone: "Europe/Stockholm", // Swedish timezone
        },
        extendedProperties: {
          shared: {
            course: course.name, // Populate as needed or leave empty
          },
        },
      };
    })
  );

  return events;
};

export const handleApplyTemplate = async (
  course: CourseType,
  navigate: NavigateFunction,
  mutation: UseMutationResult<void, Error, CourseType, unknown>
) => {
  const myTrack = course.track.id;
  const myCourse = stripIdsFromCourse(course);
  myCourse.track.id = myTrack;

  mutation.mutate(myCourse);
  navigate("/activecourses");
};

/**
 * Utility function to deeply remove `id` property from objects.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepRemoveId<T extends Record<string, any>>(obj: T): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepRemoveId(item));
  }

  if (obj instanceof Date) {
    return obj;
  }

  if (typeof obj === "object" && obj !== null) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = obj;
    return Object.entries(rest).reduce((acc, [key, value]) => {
      acc[key] = deepRemoveId(value);
      return acc;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as Record<string, any>);
  }

  return obj;
}

export function stripIdsFromCourse(course: CourseType): Omit<CourseType, "id"> {
  return deepRemoveId(course);
}

export function stripIdsFromModules(
  modules: ModuleType[]
): Omit<ModuleType, "id">[] {
  return modules.map((module) => deepRemoveId(module));
}
