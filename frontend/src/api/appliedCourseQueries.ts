import { useQuery } from "@tanstack/react-query";
import { getAppliedCourses } from "./appliedCourseFetches";
import { CourseType } from "@models/course/Types";

export function useQueryAppliedCourses() {
    const { data, isLoading, isError } = useQuery<CourseType[]>({
        queryKey: ["appliedCourses"],
        queryFn: getAppliedCourses,
    });
    return { data, isLoading, isError };
}