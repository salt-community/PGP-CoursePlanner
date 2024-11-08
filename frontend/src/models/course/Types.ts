import { AppliedModuleType } from "../appliedCourse/Types";
import { ModuleType } from "../module/Types";

export type CourseType = {
    id?: number;
    name: string;
    numberOfWeeks: number;
    moduleIds: number[];
    modules: CourseModule[];
}

export type CourseProps = {
    submitFunction: (course: CourseType) => Promise<void>;
    course: CourseType;
    buttonText: string;
}

export type CourseModule = {
    courseId?: number;
    course?: CourseType;
    moduleId?: number;
    module?: ModuleType;
}

export type AppliedCourseType = {
    id?: number;
    name: string;
    startDate: Date;
    endDate?: Date;
    courseId: number;
    color: string;
    modules?: AppliedModuleType[]
}