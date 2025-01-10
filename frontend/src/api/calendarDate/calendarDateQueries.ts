import { CalendarDateType } from "@models/calendar/Types";
import { useQuery } from "@tanstack/react-query";
import { getCalendarDate, getCalendarDateBatch, getCalendarDateWeeks } from "./calendarDateFetches";
import { getCookie } from "@helpers/cookieHelpers";
import { useState } from "react";

export function useQueryCalendarDate(date: string) {
    const { data, isLoading, isError } = useQuery<CalendarDateType>({
        queryKey: ['calendarDate', date],
        queryFn: () => getCalendarDate(date),
        enabled: !!date
    })
    return { data, isLoading, isError };
}

export function useQueryCalendarDateWeeks(currentWeek: number) {
    const { data, isLoading } = useQuery<CalendarDateType[]>({
        queryKey: ['calendarWeeks'],
        queryFn: () => getCalendarDateWeeks(currentWeek),
        enabled: !!getCookie("JWT"),
    })
    const [delayedLoading, setDelayedLoading] = useState(isLoading);

    if (!isLoading) {
        setTimeout(() => {
            setDelayedLoading(isLoading);
        }, 500)
    }
    return { data, isLoading: delayedLoading };
}

export function useQueryCalendarDateBatch(startDate: string, endDate: string) {
    const { data, isPending, isError, error } = useQuery<CalendarDateType[]>({
        queryKey: ['calendarBatch', startDate, endDate],
        queryFn: () => {
            return getCalendarDateBatch(startDate, endDate);
        },
    })
    return { data, isPending, isError, error }
}