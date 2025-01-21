import { ModuleType } from "@models/module/Types";
import { useQuery } from "@tanstack/react-query";
import { getModules, getModuleById } from "./moduleFetches";
import { useContext } from "react";
import { TrackVisibilityContext } from "../../context/TrackVisibilityContext.tsx";
import { Track } from "@models/course/Types.ts";

export function useQueryModules() {
    const { data, isLoading, isError, error } = useQuery<ModuleType[]>({
        queryKey: ['modules'],
        queryFn: getModules
    });
    const { trackVisibility } = useContext(TrackVisibilityContext);

    let filteredData = data;
    if (!isLoading) {
        const updatedData = data?.map((c) => {
            return {
                id: c.id,
                name: c.name,
                numberOfDays: c.numberOfDays,
                days: c.days,
                order: c.order,
                startDate: c.startDate,
                isApplied: c.isApplied,
                tracks: c.tracks.map((t) => {
                    const track = trackVisibility.find((item) => item.id === t.id);
                    return track as Track;
                })
            }
        })
        filteredData = updatedData?.filter((module) => module.tracks.some((t) => t.visibility));
    }

    return { data: filteredData, isLoading, isError, error };
}

export function useQueryModuleById(id: number) {
    const { data, isLoading, isError } = useQuery<ModuleType>({
        queryKey: ['modules', id],
        queryFn: () => getModuleById(id)
    })

    return { data, isLoading, isError }
}