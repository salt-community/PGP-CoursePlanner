import { format, getWeek } from "date-fns";
import Page from "../../sections/Page";
import { formatDate, today, weekDays } from "../../helpers/dateHelpers";
import WeekDay from "../../components/weekDay/WeekDay";
import { getCookie, setCookie } from "../../helpers/cookieHelpers";
import { getCalendarDate } from "../../api/CalendarDateApi";
import { useQuery } from "react-query";
import { DateContent } from "../../components/calendar/Types";
import { Link } from "react-router-dom";

export default function Home() {

    const redirectLink = "http://localhost:5173";
    const LOGIN_URL = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/calendar.events.owned&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&redirect_uri=${redirectLink}&client_id=735865474111-hbubksmrfl5l6b7tkgnjetiuqp1jvoeh.apps.googleusercontent.com`;
    if (location.search) {
        const params = new URLSearchParams(location.search);
        const auth_code = params.get('code');
        setCookie('auth_code', auth_code!, 1);
        console.log('auth code: ', auth_code);
        location.href = redirectLink;
    }

    if (location.hash) {
        const params = new URLSearchParams(location.hash);
        const accessToken = params.get('access_token');
        setCookie('access_token', accessToken!, 1);
        console.log("access token: ", accessToken);
        location.href = redirectLink;
    };

    if (!getCookie("access_token")) {
        location.href = LOGIN_URL;
    }

    const weekDayDateContent: DateContent[][] = [];
    weekDays.forEach(day => {
        const dayString = formatDate(day).replaceAll("/", "-");
        const { data, isLoading, isError } = useQuery({
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
        <Page>
            <section className="p-20 flex flex-col items-center">
                <h1 className="text-2xl font-semibold">We are in week {getWeek(new Date())}</h1>
                <section className="flex rounded-lg w-full justify-between m-5 gap-3 p-3">
                    {weekDays.map((day, index) =>
                        <>
                            {formatDate(day) == today
                                ?
                                <section className="flex flex-col border-2 border-black rounded-lg w-full gap-3">
                                    <Link to={`/calendar/day/date=${formatDate(day)}`}>
                                        <h1 className="item-center text-xl font-bold text-center">{format(formatDate(day), 'EEEE')}
                                            <br /> {day.getDate()} {monthNames[day.getMonth()]}
                                        </h1>
                                    </Link>
                                    <WeekDay key={format(day, 'd')} dateContent={weekDayDateContent[index]} />
                                </section>
                                : <section className="flex flex-col border border-black rounded-lg w-full gap-3">
                                    <Link to={`/calendar/day/date=${formatDate(day)}`}>
                                        <h1 className="item-center text-lg text-center">{format(formatDate(day), 'EEEE')}
                                            <br /> {day.getDate()} {monthNames[day.getMonth()]}
                                        </h1>
                                    </Link>
                                    <WeekDay key={format(day, 'd')} dateContent={weekDayDateContent[index]} />
                                </section>
                            }
                        </>
                    )}
                </section>
            </section>
        </Page>
    )
}