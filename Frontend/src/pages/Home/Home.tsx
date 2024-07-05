import { format, getWeek } from "date-fns";
import Page from "../../sections/Page";
import { formatDate, weekDays } from "../../helpers/dateHelpers";
import WeekDay from "../../components/weekDay/WeekDay";
import { getCookie, setCookie } from "../../helpers/cookieHelpers";
import { useNavigate } from "react-router-dom";

const redirectLink = "http://localhost:5173";
const LOGIN_URL = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/calendar.events.owned&include_granted_scopes=true&response_type=token&state=state_parameter_passthrough_value&redirect_uri=${redirectLink}&client_id=735865474111-hbubksmrfl5l6b7tkgnjetiuqp1jvoeh.apps.googleusercontent.com`;

export default function Home() {
    const navigate = useNavigate();

    if (!getCookie("access_token")) {
        location.href = LOGIN_URL;
    }

    if (location.hash) {
        const params = new URLSearchParams(location.hash);
        const accessToken = params.get('access_token');
        setCookie('access_token', accessToken!, 1);
        console.log("access token: ", accessToken);
        navigate("/home");
    };

    return (
        <Page>
            <section className="p-20 flex flex-col items-center">
                <h1 className="text-2xl font-semibold">We Are In Week {getWeek(new Date())}</h1>
                <section className="flex border border-black rounded-lg h-80 w-full justify-around m-5">
                    {weekDays.map(day =>
                        <WeekDay key={format(day, 'd')} date={formatDate(day)} />
                    )}
                </section>
            </section>
        </Page>
    )
}