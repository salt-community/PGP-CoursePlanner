import { ModuleType } from "@models/module/Types";
import { CourseType } from "../Types";

export const findDuplicates = (modules: Array<ModuleType>): boolean => {
    return modules.some((module, idx) => 
        modules.slice(idx + 1).some(other => other.id === module.id)
    );
};

export const isStringInputIncorrect = (str: string): boolean => {
    return str.trim().length === 0;
};


export const numberOfDaysInCourse = (course : CourseType) => {
    let days = 0;
    course.modules.forEach(element => {
      days += element.module.numberOfDays
    });
    return days;
  }


  export const getWeekNumberOfModule = (course : CourseType, moduleId : number) => {
    return 1;
  }

export const calculateCourseDayDates = ( course : CourseType, modules : ModuleType[], startDate : Date) => {
  console.log(startDate)
  for(i = 0; i < course.modules.length; )
}