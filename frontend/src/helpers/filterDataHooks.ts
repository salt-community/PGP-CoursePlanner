import { TrackVisibilityContext } from "@context/TrackVisibilityContext";
import { CalendarDateType, CourseType, Track } from "@api/Types";
import { ModuleType } from "@api/Types";
import { useContext, useMemo } from "react";

export function useFilterWeeksCalendar(data?: CalendarDateType[]) {
    const { trackVisibility } = useContext(TrackVisibilityContext);

    const filteredData = useMemo(() => {
        return data?.map((c) => {
            return {
                id: c.id,
                date: c.date,
                dateContent: c.dateContent.filter((d) => {
                    const track = trackVisibility.find((item) => item.id === d.track.id);
                    return track?.visibility;
                })
            }
        })
    }, [data, trackVisibility]);

    return filteredData;
}

export function useFilterMonthCalendar(data?: CalendarDateType[]) {
    const { trackVisibility } = useContext(TrackVisibilityContext);

    const filteredData = useMemo(() => {
        return data?.map((c) => {
            return {
                id: c.id,
                date: c.date,
                dateContent: c.dateContent.filter((d) => {
                    const track = trackVisibility.find((item) => item.id === d.track.id);
                    return track?.visibility;
                })
            }
        })
    }, [data, trackVisibility]);

    return filteredData;
}


export function useFilterModules(data?: ModuleType[]) {
    const { trackVisibility } = useContext(TrackVisibilityContext);

    const filteredData = useMemo(() => {
        return data?.map((m) => {
            return {
                id: m.id,
                name: m.name,
                numberOfDays: m.numberOfDays,
                days: m.days,
                order: m.order,
                startDate: m.startDate,
                isApplied: m.isApplied,
                creationDate : m.creationDate,
                tracks: m.tracks!.map((t) => {
                    const track = trackVisibility.find((track) => track.id === t.id);
                    return track as Track;
                })
            }
        }).filter((module) => module.tracks.some((track) => track?.visibility ?? false))
    }, [data, trackVisibility]);

    return filteredData as ModuleType[];
}

export function useFilterCourses(data?: CourseType[]) {
    const { trackVisibility } = useContext(TrackVisibilityContext);

    const filteredData = useMemo(() => {
        return data?.map((c) => {
            const track = trackVisibility.find((t) => t.id === c.track.id)
            return {
                id: c.id,
                name: c.name,
                startDate: c.startDate,
                endDate: c.endDate,
                numberOfWeeks: c.numberOfWeeks,
                color: c.color,
                moduleIds: c.moduleIds,
                modules: c.modules,
                isApplied: c.isApplied,
                track: track ? track : c.track,
                miscellaneousEvents : c.miscellaneousEvents,
                creationDate : c.creationDate
            }
        }).filter((course) => course.track.visibility === true);
    }, [data, trackVisibility]);

    return filteredData as CourseType[];
}