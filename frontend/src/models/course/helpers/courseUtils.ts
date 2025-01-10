import { ModuleType } from "@models/module/Types";
import { CourseType } from "../Types";
import { CalendarDateType } from "@models/calendar/Types";
import {getDateAsStringYyyyMmDd} from "@helpers/dateHelpers"

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
  console.log(course.color, moduleId);
  return 1;
};

export const calculateCourseDayDates = (
  course: CourseType,
  modules: ModuleType[],
  startDate: Date
) => {
  const calendarDateTypes: CalendarDateType[] = [];
  // Create a copy of the startDate to avoid mutating the original date
  const currentDate = new Date(startDate);
  course.startDate = new Date(startDate)
  console.log("StartDate: ",startDate)

  for (let i = 0; i < modules.length; i++) {
    for (let j = 0; j < modules[i].numberOfDays; j++) {
      // Skip weekends (Saturday: 6, Sunday: 0)
      while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
      // console.log(`Module ${i + 1}, Day ${j + 1}:`, currentDate.toDateString());
      // modules[i].days[j].date = new Date(currentDate);
      course.modules[i].module.days[j].date = new Date(currentDate)
      course.endDate = new Date(currentDate)
      calendarDateTypes.push({
        date: new Date(currentDate),
        dateContent: [
          {
            dayOfModule: modules[i].days[j].dayNumber,
            totalDaysInModule: modules[i].numberOfDays, 
            courseName: course.name,
            events: modules[i].days[j].events,
            color: course.color ? course.color : "#777777",
            appliedCourseId: course.id,
            moduleName: modules[i].name,
          },
        ],
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  return calendarDateTypes;
};


/**
 * Utility function to deeply remove `id` property from objects.
 */
/**
 * Utility function to deeply remove `id` property from objects.
 */
export function deepRemoveId<T extends Record<string, any>>(obj: T): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepRemoveId(item));
  }

  if (obj instanceof Date) {
    return obj; // Return Date objects as-is
  }

  if (typeof obj === "object" && obj !== null) {
    const { id, ...rest } = obj; // Remove `id` if it exists
    return Object.entries(rest).reduce((acc, [key, value]) => {
      acc[key] = deepRemoveId(value); // Recursively process nested properties
      return acc;
    }, {} as Record<string, any>);
  }

  return obj; // Primitive values are returned as-is
}


/**
 * Strip `id` recursively from a CourseType object.
 */
export function stripIdsFromCourse(course: CourseType): Omit<CourseType, "id"> {
  return deepRemoveId(course);
}

/**
 * Strip `id` recursively from a ModuleType object.
 */
export function stripIdsFromModules(modules: ModuleType[]): Omit<ModuleType, "id">[] {
  return modules.map((module) => deepRemoveId(module));
}
