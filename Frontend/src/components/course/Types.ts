import { ModuleType } from "../module/Types";

export type CourseType = {
    name: string;
    numberOfWeeks: number;
    modules: ModuleType[];
}