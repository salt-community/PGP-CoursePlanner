import { ModuleType } from "@models/module/Types";
import { useQuery } from "@tanstack/react-query";
import { getModules, getModuleById } from "./moduleFetches";
import { useFilterModule } from "@helpers/filterData";

export function useQueryModules() {
    const { data, isLoading, isError, error } = useQuery<ModuleType[]>({
        queryKey: ['modules'],
        queryFn: getModules
    });

    return { data: useFilterModule(data), isLoading, isError, error };
}

export function useQueryModuleById(id: number) {
    const { data, isLoading, isError } = useQuery<ModuleType>({
        queryKey: ['modules', id],
        queryFn: () => getModuleById(id)
    })

    return { data, isLoading, isError }
}