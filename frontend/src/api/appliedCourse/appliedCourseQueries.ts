import { useQuery } from "@tanstack/react-query";
import { getAppliedCourseById, getAppliedCourses } from "./appliedCourseFetches";
import { CourseType } from "@api/Types";
import { useState } from "react";
import { useFilterCourses } from "@helpers/filterDataHooks";

export function useQueryAppliedCourses() {
    const { data, isLoading, isError } = useQuery<CourseType[]>({
        queryKey: ["appliedCourses"],
        queryFn: getAppliedCourses,
    });
    
    const [delayedLoading, setDelayedLoading] = useState(isLoading);
    if (!isLoading) {
        setTimeout(() => {
            setDelayedLoading(isLoading);
        }, 500)
    }

    return { data: useFilterCourses(data), isLoading: delayedLoading, isError };
}

export function useQueryAppliedCourseById(id: number) {
    const { data, isLoading, isError } = useQuery<CourseType>({
        queryKey: ['appliedCourses', id],
        queryFn: () => getAppliedCourseById(id)
    })
    return { data, isLoading, isError }
}