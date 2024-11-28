import { useQuery } from "@tanstack/react-query";
import { deleteCookie, getCookie, setCookie } from "@helpers/cookieHelpers";
import { currentMonth, currentWeek, currentYear, getDateAsString, today, weekDays, weekDaysNextWeek } from "../helpers/dateHelpers";
import { getCalendarDateWeeks } from "@api/CalendarDateApi";
import { getWeek, format } from "date-fns";
import { Link } from "react-router-dom";
import Page from "@components/Page";
import WeekDay from "./calendar/sections/WeekDay";
import { CalendarDateType } from "./calendar/Types";
import { getTokens, tokenResponse } from "@api/UserApi";
import Login from "./login/Login";
import { getHomeUrl, trackUrl } from "@helpers/helperMethods";
import LoadingMessage from "@components/LoadingMessage";
import ErrorMessage from "@components/ErrorMessage";
import { useEffect, useState } from "react";

const homePage = getHomeUrl();

export default function Home() {
    trackUrl();
    const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);

    useEffect(() => {
        if (location.search) {
            const params = new URLSearchParams(location.search);
            setSearchParams(params);
        }
    }, [location.search]);

    if (searchParams) {
        const code = searchParams.get('code')!;
        setCookie("auth_code", code);
    }

    const { data: tokenData } = useQuery<tokenResponse>({
        queryKey: ['accessCode'],
        queryFn: () => getTokens(getCookie("auth_code")!, homePage),
        enabled: !!getCookie("auth_code"),
    })

    if (tokenData !== undefined) {
        const { access_token, id_token, expires_in } = tokenData;
        setCookie('access_token', access_token, expires_in);
        setCookie('JWT', id_token, expires_in);
        deleteCookie('auth_code');
    }

    const { data, isLoading: isCalendarLoading, isError: isCalendarError } = useQuery<CalendarDateType[]>({
        queryKey: ['CalendarWeeks'],
        queryFn: () => getCalendarDateWeeks(currentWeek),
        enabled: !!getCookie("JWT"),
    })

    const thisWeek = new Date();
    const nextWeek = new Date(thisWeek);
    nextWeek.setDate(thisWeek.getDate() + 7)
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    if (!getCookie("auth_code") && !getCookie("JWT") && !getCookie("access_token")) {
        return <Login />
    }

    if (isCalendarLoading) {
        return <LoadingMessage />
    }

    if (isCalendarError) {
        return <ErrorMessage />
    }

    return (
        <Page>
            <section className="pl-20 pr-20 pb-20 flex flex-col items-center">
                <h1 className="text-2xl font-semibold">Current Week {getWeek(new Date())}</h1>
                <section className="flex rounded-lg w-full justify-between m-5 gap-3 p-5">
                    {weekDays.map((day, index) =>
                        getDateAsString(day) == today
                            ? (
                                <section key={format(day, 'd')} className="flex flex-col border-2 border-primary rounded-lg w-full gap-3">
                                    <Link to={`/calendar/day/date=${getDateAsString(day)}`} className="hover:-translate-y-0.5">
                                        <h1 className="item-center text-xl font-bold text-center text-primary">{format(getDateAsString(day), 'EEEE')}
                                            <br /> {day.getDate()} {monthNames[day.getMonth()]}
                                        </h1>
                                    </Link>
                                    {data && data[index] !== null ? <WeekDay dateContent={data[index].dateContent} /> : ""}
                                </section>
                            ) : (<section key={format(day, 'd')} className="flex flex-col border border-black rounded-lg w-full gap-3">
                                <Link to={`/calendar/day/date=${getDateAsString(day)}`} className="hover:-translate-y-0.5">
                                    <h1 className="item-center text-lg text-center">{format(getDateAsString(day), 'EEEE')}
                                        <br /> {day.getDate()} {monthNames[day.getMonth()]}
                                    </h1>
                                </Link>
                                {data && data[index] !== null ? <WeekDay dateContent={data[index].dateContent} /> : ""}
                            </section>
                            ))}
                </section>
                <h1 className="text-2xl font-semibold">Next Week {getWeek(nextWeek)}</h1>
                <section className="flex rounded-lg w-full justify-between m-5 gap-3 p-3">
                    {weekDaysNextWeek.map((day, index) =>

                        <section key={format(day, 'd')} className="flex flex-col border border-black rounded-lg w-full gap-3">
                            <Link to={`/calendar/day/date=${getDateAsString(day)}`} className="hover:-translate-y-0.5">
                                <h1 className="item-center text-lg text-center">{format(getDateAsString(day), 'EEEE')}
                                    <br /> {day.getDate()} {monthNames[day.getMonth()]}
                                </h1>
                            </Link>
                            {data && data[index + 7] !== null ? <WeekDay dateContent={data[index + 7].dateContent} /> : ""}
                        </section>
                    )}
                </section>
                <div className="flex flex-row gap-2">
                    <Link to={`/calendar/month/monthyear=${currentMonth}-${currentYear}`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to calendar</Link>
                    <Link to={`/calendar/timeline`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to timeline</Link>
                </div>
            </section>
        </Page>
    )
}