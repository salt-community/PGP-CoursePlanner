export type CourseType = {
    id?: number;
    name: string;
    startDate: Date;
    endDate?: Date;
    numberOfWeeks?: number;
    moduleIds?: number[];
    color?: string;
    isApplied?: boolean;
}

export type CourseProps = {
    submitFunction: (course: CourseType) => Promise<void>;
    course: CourseType;
    buttonText: string;
}