import { TrackVisibilityContext } from "@context/TrackVisibilityContext";
import { Track } from "@models/course/Types";
import { ModuleType } from "@models/module/Types";
import { useContext } from "react";

export function useFilterModule(data: ModuleType[] | undefined) {
    const { trackVisibility } = useContext(TrackVisibilityContext);

    data = data?.map((c) => {
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
    return data?.filter((module) => module.tracks.some((t) => t.visibility));
}