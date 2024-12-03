import { useQuery } from "@tanstack/react-query";
import { getAppliedCourseById, getAppliedCourses } from "./appliedCourseFetches";
import { CourseType } from "@models/course/Types";

export function useQueryAppliedCourses() {
    const { data, isLoading, isError } = useQuery<CourseType[]>({
        queryKey: ["appliedCourses"],
        queryFn: getAppliedCourses,
    });
    return { data, isLoading, isError };
}

export function useQueryAppliedCourseById(id: number) {
    const { data, isLoading, isError } = useQuery<CourseType>({
        queryKey: ['appliedCourses', id],
        queryFn: () => getAppliedCourseById(id)
    })
    return { data, isLoading, isError }
}