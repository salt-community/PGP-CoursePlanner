import { ModuleType } from "../module/Types";

export type CourseType = {
    id?: number;
    name: string;
    numberOfWeeks: number;
    modules: ModuleType[];
}

export type CourseProps = {
    submitFunction: (course: CourseType) => Promise<void>;
    course: CourseType;
    buttonText: string;
}