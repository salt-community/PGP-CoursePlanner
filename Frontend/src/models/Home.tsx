import { useQuery } from "react-query";
import { deleteCookie, getCookie, setCookie } from "../helpers/cookieHelpers";
import { getDateAsString, today, weekDays } from "../helpers/dateHelpers";
import { getCalendarDate } from "../api/CalendarDateApi";
import { getWeek, format } from "date-fns";
import { Link } from "react-router-dom";
import Page from "../components/Page";
import WeekDay from "./calendar/sections/WeekDay";
import { DateContent } from "./calendar/Types";
import NavigateToLogin from "./login/NavigateToLogin";
import { getTokens, getTokensFromBackend } from "../api/UserApi";

export default function Home() {

    // const redirectLink = "https://frontend-h7ia67qbhq-uc.a.run.app";
    const redirectLink = "http://localhost:5173";

    if (location.search) {
        const params = new URLSearchParams(location.search);
        const code = params.get('code')!;


        const { data: response, isLoading, isError } = useQuery({
            queryKey: ['accessCode'],
            queryFn: () => getTokensFromBackend(code)
        })

        if (isLoading) {
            console.log("loading...")
            setCookie('access_token', "soon to be set!");
        }

        isError && deleteCookie('access_token');

        if (response) {
            console.log("response from code: ", response);
            const { access_token, id_token, expires_in } = response;

            setCookie('access_token', access_token, 10);
            setCookie('JWT', id_token, 10);

            location.href = redirectLink;
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

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        getCookie("access_token") == undefined ?
            <NavigateToLogin path={window.location.href} />
            :
            <Page>
                <section className="p-20 flex flex-col items-center">
                    <h1 className="text-2xl font-semibold">We are in week {getWeek(new Date())}</h1>
                    <section className="flex rounded-lg w-full justify-between m-5 gap-3 p-3">
                        {weekDays.map((day, index) =>
                            <>
                                {getDateAsString(day) == today
                                    ?
                                    <section className="flex flex-col border-2 border-black rounded-lg w-full gap-3">
                                        <Link to={`/calendar/day/date=${getDateAsString(day)}`}>
                                            <h1 className="item-center text-xl font-bold text-center">{format(getDateAsString(day), 'EEEE')}
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
                    <div className="flex flex-row gap-2">
                        <Link to={`/calendar/month`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to calendar</Link>
                        <Link to={`/calendar/timeline`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to timeline</Link>
                    </div>
                </section>
            </Page>
    )
}