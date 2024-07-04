import { useNavigate } from "react-router-dom";
import CloseBtn from "../../components/buttons/CloseBtn";
import Page from "../../sections/Page";
import { getDateFromPath } from "../../helpers/helperMethods";
import { getCalendarDate } from "../../api/CalendarDateApi";
import { useQuery } from "react-query";
import WeekDay from "../../components/weekDay/WeekDay";
import { formatDate } from "../../helpers/dateHelpers";
import { DateContent } from "../../components/calendar/Types";
import { format } from "date-fns";
import NextBtn from "../../components/buttons/NextBtn";
import PreviousBtn from "../../components/buttons/PreviousBtn";


export default function DayDetails() {
    const navigate = useNavigate();
    const date = getDateFromPath();

    const dateAsDate = new Date(date);

    var nextDate = new Date(dateAsDate)
    nextDate = new Date(nextDate.setDate(nextDate.getDate() + 1));
    const nextDay = formatDate(nextDate);

    var previousDate = new Date(dateAsDate)
    previousDate = new Date(previousDate.setDate(previousDate.getDate() - 1));
    const previousDay = formatDate(previousDate)

    const dateForApi = date.replaceAll("/", "-");
    const { data, isLoading, isError } = useQuery({
        queryKey: ['calendarDates', dateForApi],
        queryFn: () => getCalendarDate(dateForApi)
    });

    let dateContent: DateContent[] = [];
    if (data != undefined)
        dateContent = data.dateContent;
    else
        dateContent = [];

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <Page>
            <section className="flex justify-around">
                <div></div>
                <div className="h-[100px] flex items-end">
                    <PreviousBtn onClick={() => navigate("/home/details/date=" + previousDay)} />
                </div>
                <section className="w-1/2 flex justify-center bg-background">
                    <div className="w-full bg-base-100 shadow-xl p-5">
                        <div className="flex justify-end">
                            <CloseBtn onClick={() => navigate("/calendar/month")} />
                        </div>
                        <h1 className="mb-4 item-center text-xl font-bold text-center">{format(formatDate(dateAsDate), 'EEEE')}
                            <br /> {dateAsDate.getDate()} {monthNames[dateAsDate.getMonth()]}
                        </h1>
                        <div>
                            <WeekDay dateContent={dateContent} />
                        </div>
                    </div>
                </section>
                <div className="h-[100px] flex items-end">
                    <NextBtn onClick={() => navigate("/home/details/date=" + nextDay)} />
                </div>
                <div></div>
            </section>
        </Page>
    )

}