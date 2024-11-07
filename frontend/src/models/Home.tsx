import { useQuery } from "@tanstack/react-query";
import { deleteCookie, getCookie, setCookie } from "../helpers/cookieHelpers";
import { currentMonth, currentWeek, currentYear, getDateAsString, today, weekDays, weekDaysNextWeek } from "../helpers/dateHelpers";
import { getCalendarDateWeeks } from "../api/CalendarDateApi";
import { getWeek, format } from "date-fns";
import { Link } from "react-router-dom";
import Page from "../components/Page";
import WeekDay from "./calendar/sections/WeekDay";
import { CalendarDateType } from "./calendar/Types";
import { getTokens } from "../api/UserApi";
import Login from "./login/Login";
import { getHomeUrl, trackUrl } from "../helpers/helperMethods";
import LoadingMessage from "../components/LoadingMessage";

const homePage = getHomeUrl();

export default function Home() {
    trackUrl();

    const thisWeek = new Date();
    const nextWeek = new Date(thisWeek);
    nextWeek.setDate(thisWeek.getDate() + 7)

    let loading = false;

    const { data: response, isLoading, isError } = useQuery({
        queryKey: ['accessCode'],
        queryFn: () => getTokens(getCookie("auth_code")!, homePage)
    })

    if (location.search) {
        const params = new URLSearchParams(location.search);
        const code = params.get('code')!;
        setCookie("auth_code", code);

        if (isLoading) {
            loading = true;
        }

        isError && deleteCookie('access_token');

        if (response !== undefined) {
            const { access_token, id_token, expires_in } = response;

            setCookie('access_token', access_token, expires_in);
            setCookie('JWT', id_token, expires_in);
            deleteCookie("auth_code");

            location.href = homePage;
        }
    }

    const { isPending, data } = useQuery<CalendarDateType[]>({
        queryKey: ['todos'],
        queryFn: () => getCalendarDateWeeks(currentWeek),
      })

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    if(isPending) return "pending"
    return (
        loading
            ? <LoadingMessage />
            : !getCookie("access_token")
                || getCookie("access_token") == "undefined"
                ? <Login />
                : <Page>
                    <section className="pl-20 pr-20 pb-20 flex flex-col items-center">
                        <h1 className="text-2xl font-semibold">We are in week {getWeek(new Date())}</h1>
                        <section className="flex rounded-lg w-full justify-between m-5 gap-3 p-3">
                            {weekDays.map((day, index) =>
                                getDateAsString(day) == today
                                        ?(
                                        <section key={format(day, 'd')} className="flex flex-col border-2 border-primary rounded-lg w-full gap-3">
                                            <Link to={`/calendar/day/date=${getDateAsString(day)}`} className="hover:italic">
                                                <h1 className="item-center text-xl font-bold text-center text-primary">{format(getDateAsString(day), 'EEEE')}
                                                    <br /> {day.getDate()} {monthNames[day.getMonth()]}
                                                </h1>
                                            </Link>
                                            { data && data[index] !== null ? <WeekDay dateContent = {data[index].dateContent}/> : "" }
                                        </section>
                                        ): ( <section key={format(day, 'd')} className="flex flex-col border border-black rounded-lg w-full gap-3">
                                            <Link to={`/calendar/day/date=${getDateAsString(day)}`} className="hover:italic">
                                                <h1 className="item-center text-lg text-center">{format(getDateAsString(day), 'EEEE')}
                                                    <br /> {day.getDate()} {monthNames[day.getMonth()]}
                                                </h1>
                                            </Link>
                                            { data && data[index] !== null ? <WeekDay dateContent = {data[index].dateContent}/> : "" }
                                        </section>
                                    ))}
                        </section>
                        <h1 className="text-2xl font-semibold">Week {getWeek(nextWeek)}</h1>
                        <section className="flex rounded-lg w-full justify-between m-5 gap-3 p-3">
                            {weekDaysNextWeek.map((day, index) =>
                                
                                    <section key={format(day, 'd')} className="flex flex-col border border-black rounded-lg w-full gap-3">
                                        <Link to={`/calendar/day/date=${getDateAsString(day)}`} className="hover:italic">
                                            <h1 className="item-center text-lg text-center">{format(getDateAsString(day), 'EEEE')}
                                                <br /> {day.getDate()} {monthNames[day.getMonth()]}
                                            </h1>
                                        </Link>
                                        {data && data[index+7] !== null ? <WeekDay dateContent = {data[index+7].dateContent}/> : "" }
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