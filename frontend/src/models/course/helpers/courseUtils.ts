import { ModuleType } from "@models/module/Types";
import { CourseType } from "../Types";
import { CalendarDateType } from "@models/calendar/Types";

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
  // console.log(course.color, moduleId)
  return 1;
};

export const calculateCourseDayDates = (
  course: CourseType,
  modules: ModuleType[],
  startDate: Date
) => {

  const calendarDateTypes : CalendarDateType[] = []
  // Create a copy of the startDate to avoid mutating the original date
  const currentDate = new Date(startDate);

  for (let i = 0; i < modules.length; i++) {
    for (let j = 0; j < modules[i].numberOfDays; j++) {
      // Skip weekends (Saturday: 6, Sunday: 0)
      while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
      // console.log(`Module ${i + 1}, Day ${j + 1}:`, currentDate.toDateString());
      calendarDateTypes.push({date: currentDate, dateContent: [{dayOfModule: modules[i].days[j].dayNumber, totalDaysInModule: modules[i].numberOfDays, courseName: course.name, events: modules[i].days[j].events, color: course.color ? course.color : "#777777" }] })
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  return calendarDateTypes;
};
