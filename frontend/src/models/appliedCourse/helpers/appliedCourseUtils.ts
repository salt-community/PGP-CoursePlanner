import { CourseModuleType, CourseType } from "@models/course/Types";
import { UseMutationResult } from "@tanstack/react-query";

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
      track: [],
      isApplied: false,
      numberOfDays: 0,
      days: [],
      startDate: new Date(),
    },
  };

  setCourse((prevCourse) => ({
    ...prevCourse,
    modules: [...prevCourse.modules, newModule],
  }));
};

export const handleUpdateCourse = (
  appliedCourse: CourseType,
  course: CourseType,
  setCourse: React.Dispatch<React.SetStateAction<CourseType>>,
  mutationUpdateAppliedCourse: UseMutationResult<void, Error, CourseType, unknown>

) => {
  if (appliedCourse) {
    const updatedCourse = assignDatesToModules(course, setCourse);
    mutationUpdateAppliedCourse.mutate(updatedCourse);
  }
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
    (a, b) => a.module.order - b.module.order
  );

  const updatedModules = sortedModules.map((module) => {
    const moduleDays = weekdays.slice(
      dateIndex,
      dateIndex + module.module.days.length
    );
    dateIndex += module.module.days.length;

    const updatedDays = module.module.days.map((existingDay, index) => ({
      ...existingDay,
      date: moduleDays[index].toISOString(),
    }));

    return {
      ...module,
      module: {
        ...module.module,
        days: updatedDays,
      },
    };
  });

  setCourse({
    ...course,
    modules: updatedModules,
  });
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
