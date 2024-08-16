import { useQuery } from "@tanstack/react-query";
import { deleteCookie, getCookie, setCookie } from "../helpers/cookieHelpers";
import { currentMonth, currentYear, getDateAsString, today, weekDays, weekDaysNextWeek } from "../helpers/dateHelpers";
import { getCalendarDate } from "../api/CalendarDateApi";
import { getWeek, format } from "date-fns";
import { Link } from "react-router-dom";
import Page from "../components/Page";
import WeekDay from "./calendar/sections/WeekDay";
import { DateContent } from "./calendar/Types";
import { getTokens } from "../api/UserApi";
import Login from "./login/Login";

export default function Home() {

    const thisWeek = new Date();
    const nextWeek = new Date(thisWeek);
    nextWeek.setDate(thisWeek.getDate() + 7)

    if (location.search) {
        const params = new URLSearchParams(location.search);
        const code = params.get('code')!;

        const { data: response, isLoading, isError } = useQuery({
            queryKey: ['accessCode'],
            queryFn: () => getTokens(code)
        })

        if (isLoading) {
            setCookie('access_token', "soon to be set!");
        }

        isError && deleteCookie('access_token');
        console.log(response)

        if (response) {
            const { access_token, id_token, expires_in } = response;

            setCookie('access_token', access_token, expires_in);
            setCookie('JWT', id_token, expires_in);

            location.href = import.meta.env.VITE_REDIRECT_LINK;
        }
    }

    const weekDayDateContent: DateContent[][] = [];
    weekDays.forEach(day => {
        const dayString = getDateAsString(day).replaceAll("/", "-");
        const { data } = useQuery({
            queryKey: ['calendarDates', dayString],
            queryFn: () => getCalendarDate(dayString)
        });
        if (data != undefined)
            weekDayDateContent.push(data.dateContent);
        else
            weekDayDateContent.push([]);
    });

    const weekDayDateContentNextWeek: DateContent[][] = [];
    weekDaysNextWeek.forEach(day => {
        const dayString = getDateAsString(day).replaceAll("/", "-");
        const { data } = useQuery({
            queryKey: ['calendarDates', dayString],
            queryFn: () => getCalendarDate(dayString)
        });
        if (data != undefined)
            weekDayDateContentNextWeek.push(data.dateContent);
        else
            weekDayDateContentNextWeek.push([]);
    });

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        getCookie("access_token") == undefined
            ? <Login />
            : <Page>
                <section className="pl-20 pr-20 pb-20 flex flex-col items-center">
                    <h1 className="text-2xl font-semibold">We are in week {getWeek(new Date())}</h1>
                    <section className="flex rounded-lg w-full justify-between m-5 gap-3 p-3">
                        {weekDays.map((day, index) =>
                            <>
                                {getDateAsString(day) == today
                                    ?
                                    <section className="flex flex-col border-2 border-primary rounded-lg w-full gap-3">
                                        <Link to={`/calendar/day/date=${getDateAsString(day)}`}>
                                            <h1 className="item-center text-xl font-bold text-center text-primary">{format(getDateAsString(day), 'EEEE')}
                                                <br /> {day.getDate()} {monthNames[day.getMonth()]}
                                            </h1>
                                        </Link>
                                        <WeekDay key={format(day, 'd')} dateContent={weekDayDateContent[index]} />
                                    </section>
                                    : <section className="flex flex-col border border-black rounded-lg w-full gap-3">
                                        <Link to={`/calendar/day/date=${getDateAsString(day)}`}>
                                            <h1 className="item-center text-lg text-center">{format(getDateAsString(day), 'EEEE')}
                                                <br /> {day.getDate()} {monthNames[day.getMonth()]}
                                            </h1>
                                        </Link>
                                        <WeekDay key={format(day, 'd')} dateContent={weekDayDateContent[index]} />
                                    </section>
                                }
                            </>
                        )}
                    </section>
                    <h1 className="text-2xl font-semibold">Week {getWeek(nextWeek)}</h1>
                    <section className="flex rounded-lg w-full justify-between m-5 gap-3 p-3">
                        {weekDaysNextWeek.map((day, index) =>
                            <>
                                <section className="flex flex-col border border-black rounded-lg w-full gap-3">
                                    <Link to={`/calendar/day/date=${getDateAsString(day)}`}>
                                        <h1 className="item-center text-lg text-center">{format(getDateAsString(day), 'EEEE')}
                                            <br /> {day.getDate()} {monthNames[day.getMonth()]}
                                        </h1>
                                    </Link>
                                    <WeekDay key={format(day, 'd')} dateContent={weekDayDateContentNextWeek[index]} />
                                </section>
                            </>
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