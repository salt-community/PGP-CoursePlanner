import { useQuery } from "@tanstack/react-query";
import { getAllAppliedCourses } from "./appliedCourseFetches";
import { CourseType } from "@models/course/Types";

export function useQueryAppliedCourses() {
    const { data, isLoading, isError } = useQuery<CourseType[]>({
        queryKey: ["appliedCourses"],
        queryFn: getAllAppliedCourses,
    });
    return { data, isLoading, isError };
}