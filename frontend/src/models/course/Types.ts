import { ModuleType } from "../module/Types";

export type CourseType = {
    id?: number;
    name: string;
    startDate: Date;
    endDate?: Date;
    numberOfWeeks?: number;
    moduleIds?: number[];
    modules?: CourseModule[];
    color?: string;
    isApplied?: boolean;
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