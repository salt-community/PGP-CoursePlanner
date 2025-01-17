import { CalendarDateType } from "@models/calendar/Types";
import { useQuery } from "@tanstack/react-query";
import { getCalendarDate, getCalendarDateBatch, getCalendarDateWeeks } from "./calendarDateFetches";
import { getCookie } from "@helpers/cookieHelpers";
import { useContext, useState } from "react";
import { TrackVisibilityContext } from "../../context/TrackVisibilityContext.tsx";

export function useQueryCalendarDate(date: string) {
    const { data, isLoading, isError } = useQuery<CalendarDateType>({
        queryKey: ['calendarDate', date],
        queryFn: () => getCalendarDate(date),
        enabled: !!date
    })
    return { data, isLoading, isError };
}

export function useQueryCalendarDateWeeks(currentWeek: number) {
    const { data, isLoading, isError } = useQuery<CalendarDateType[]>({
        queryKey: ['calendarWeeks'],
        queryFn: () => getCalendarDateWeeks(currentWeek),
        enabled: !!getCookie("JWT"),
    })
    const [delayedLoading, setDelayedLoading] = useState(isLoading);
    const { trackVisibility } = useContext(TrackVisibilityContext);

    let filteredData = data;
    if (!isLoading) {
        setTimeout(() => {
            setDelayedLoading(isLoading);
        }, 500)

        filteredData = data?.map((c) => {
            return {
                id: c.id,
                date: c.date,
                dateContent: c.dateContent.filter((d) => {
                    const track = trackVisibility.find((item) => item.id === d.track.id);
                    return track?.visibility;
                })
            }
        })
    }
    return { data: filteredData, isLoading: delayedLoading, isError };
}

export function useQueryCalendarDateBatch(startDate: string, endDate: string) {
    const { data, isLoading, isError } = useQuery<CalendarDateType[]>({
        queryKey: ['calendarBatch', startDate, endDate],
        queryFn: () => {
            return getCalendarDateBatch(startDate, endDate);
        },
    })
    const [delayedLoading, setDelayedLoading] = useState(isLoading);
    const { trackVisibility } = useContext(TrackVisibilityContext);

    let filteredData = data;
    if (!isLoading) {
        setTimeout(() => {
            setDelayedLoading(isLoading);
        }, 500)

        filteredData = data?.map((c) => {
            return {
                id: c.id,
                date: c.date,
                dateContent: c.dateContent.filter((d) => {
                    const track = trackVisibility.find((item) => item.id === d.track.id);
                    return track?.visibility;
                })
            }
        })
    }
    return { data: filteredData, isLoading: delayedLoading, isError };
}