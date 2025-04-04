import {
  getNewWeekDayDate,
  stripIdsFromCourse,
} from "@models/course/helpers/courseUtils";
import { CourseModuleType, CourseType } from "@api/Types";
import { UseMutationResult } from "@tanstack/react-query";
import { NavigateFunction } from "react-router-dom";

export const handleCreateNewAppliedModule = (
  course: CourseType,
  setCourse: React.Dispatch<React.SetStateAction<CourseType>>
) => {
  const newModule: CourseModuleType = {
    courseId: course.id || 0,
    moduleId: 0,
    module: {
      id: 0,
      name: "New module",
      order: course.modules.length,
      tracks: [],
      isApplied: false,
      numberOfDays: 0,
      days: [],
      startDate: getNewWeekDayDate(course.endDate!, 1),
      creationDate: new Date(),
    },
  };

  setCourse((prevCourse) => ({
    ...prevCourse,
    modules: [...prevCourse.modules, newModule],
  }));
};

export const handleUpdateCourse = async (
  course: CourseType,
  navigate: NavigateFunction,
  mutation: UseMutationResult<void, Error, CourseType, unknown>
) => {
  console.log("UPDATING COURSE", course);

  const myTrack = course.track.id;
  const myCourseId = course.id;
  const myCourse = stripIdsFromCourse(course);
  myCourse.track.id = myTrack;
  myCourse.id = myCourseId;
  const firstModule = course.modules.sort(
    (a, b) =>
      new Date(a.module.startDate ?? 0).getTime() -
      new Date(b.module.startDate ?? 0).getTime()
  )[0];
  console.log("First module start date", firstModule.module.startDate);

  if (firstModule) {
    const localStartDate = firstModule.module.startDate
      ? new Date(firstModule.module.startDate)
      : new Date();
    localStartDate.setHours(localStartDate.getHours() + 1);
    myCourse.startDate = localStartDate.toISOString();
  }

  const latestDayDate = course.modules
    .flatMap((module) => module.module.days)
    .map((day) => new Date(day.date))
    .reduce(
      (latest, current) => (current > latest ? current : latest),
      new Date(0)
    );

  if (latestDayDate.getTime() > 0) {
    latestDayDate.setHours(latestDayDate.getHours() + 1);
    myCourse.endDate = latestDayDate.toISOString();
  }

  console.log("UPDATING myCourse", myCourse);

  mutation.mutate(myCourse);
  navigate("/activecourses");
  return;
};

export function assignDatesToModules(
  course: CourseType,
  setCourse: React.Dispatch<React.SetStateAction<CourseType>>
) {
  const totalDays = course.modules.reduce(
    (sum, module) => sum + module.module.days.length,
    0
  );
  const weekdays = getWeekDayList(course.startDate, totalDays);

  let dateIndex = 0;

  const sortedModules = [...course.modules].sort(
    (a, b) => (a.module.order ?? Infinity) - (b.module.order ?? Infinity)
  );

  const updatedModules = sortedModules.map((module) => {
    const moduleDays = weekdays.slice(
      dateIndex,
      dateIndex + module.module.days.length
    );
    dateIndex += module.module.days.length;

    const updatedDays = module.module.days.map((existingDay, index) => ({
      ...existingDay,
      date: moduleDays[index],
    }));

    return {
      ...module,
      module: {
        ...module.module,
        numberOfDays: updatedDays.length,
        days: updatedDays,
      },
    };
  });

  setCourse({
    ...course,
    modules: updatedModules,
  });

  return course;
}

function getWeekDayList(startDate: Date, totalDays: number): Date[] {
  const days: Date[] = [];
  const start = new Date(startDate);

  for (
    let current = new Date(start);
    days.length < totalDays;
    current.setDate(current.getDate() + 1)
  ) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      days.push(new Date(current));
    }
  }

  return days;
}
