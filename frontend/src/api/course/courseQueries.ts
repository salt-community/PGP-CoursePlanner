import { CourseType } from "@models/course/Types";
import { useQuery } from "@tanstack/react-query";
import { getCourses, getCourseById, getModulesByCourseId } from "./courseFetches";
import { ModuleType } from "@models/module/Types";
import { useState } from "react";
import { useFilterCourses } from "@helpers/filterDataHooks";

export function useQueryCourses()  {
    const { data, isLoading, isError } = useQuery<CourseType[]>({
        queryKey: ['courses'],
        queryFn: getCourses
    });

    const [delayedLoading, setDelayedLoading] = useState(isLoading);
    if (!isLoading) {
        setTimeout(() => {
            setDelayedLoading(isLoading);
        }, 500)
    }

    return { data: useFilterCourses(data), isLoading: delayedLoading, isError };
}

export function useQueryCourseById(id: number) {
    const { data, isLoading, isError } = useQuery<CourseType>({
        queryKey: ['courses', id],
        queryFn: () => getCourseById(id)
    });

    return { data, isLoading, isError };
}

export function useQueryModulesByCourseId(id: number) {
    const { data, isLoading, isError } = useQuery<ModuleType[]>({
        queryKey: ["courseModules", id],
        queryFn: () => getModulesByCourseId(id),
        enabled: !!id
    });

    return { data, isLoading, isError };
}