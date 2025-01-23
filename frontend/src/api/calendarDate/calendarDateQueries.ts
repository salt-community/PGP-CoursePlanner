import { CalendarDateType } from "@models/calendar/Types";
import { useQuery } from "@tanstack/react-query";
import { getCalendarDate, getCalendarDateBatch, getCalendarDateWeeks } from "./calendarDateFetches";
import { useState } from "react";
import { useFilterMonthCalendar, useFilterWeeksCalendar } from "@helpers/filterDataHooks.ts";

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
    })

    const [delayedLoading, setDelayedLoading] = useState(isLoading);
    if (!isLoading) {
        setTimeout(() => {
            setDelayedLoading(isLoading);
        }, 500)
    }
    return { data: useFilterWeeksCalendar(data), isLoading: delayedLoading, isError };
}

export function useQueryCalendarDateBatch(startDate: string, endDate: string) {
    const { data, isLoading, isError } = useQuery<CalendarDateType[]>({
        queryKey: ['calendarBatch', startDate, endDate],
        queryFn: () => {
            return getCalendarDateBatch(startDate, endDate);
        },
    })

    const [delayedLoading, setDelayedLoading] = useState(isLoading);
    if (!isLoading) {
        setTimeout(() => {
            setDelayedLoading(isLoading);
        }, 500)
    }

    return { data: useFilterMonthCalendar(data), isLoading: delayedLoading, isError };
}