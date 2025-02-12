import { ModuleType } from "@models/course/Types";
import { useQuery } from "@tanstack/react-query";
import { getModules, getModuleById } from "./moduleFetches";
import { useFilterModules } from "@helpers/filterDataHooks";
import { useState } from "react";

export function useQueryModules() {
    const { data, isLoading, isError, error } = useQuery<ModuleType[]>({
        queryKey: ['modules'],
        queryFn: getModules
    });

    const [delayedLoading, setDelayedLoading] = useState(isLoading);
    if (!isLoading) {
        setTimeout(() => {
            setDelayedLoading(isLoading);
        }, 500)
    }
    return { data: useFilterModules(data), isLoading: delayedLoading, isError, error };
}

export function useQueryModuleById(id: number) {
    const { data, isLoading, isError } = useQuery<ModuleType>({
        queryKey: ['modules', id],
        queryFn: () => getModuleById(id)
    })

    return { data, isLoading, isError }
}