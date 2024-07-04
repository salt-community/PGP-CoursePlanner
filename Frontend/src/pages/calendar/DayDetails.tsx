import { useNavigate } from "react-router-dom";
import CloseBtn from "../../components/buttons/CloseBtn";
import Page from "../../sections/Page";
import { getDateFromPath } from "../../helpers/helperMethods";
import { getCalendarDate } from "../../api/CalendarDateApi";
import { useQuery } from "react-query";
import WeekDay from "../../components/weekDay/WeekDay";
import { formatDate } from "../../helpers/dateHelpers";
import { DateContent } from "../../components/calendar/Types";


export default function DayDetails() {
    const navigate = useNavigate();
    const date = getDateFromPath();

    const dateForApi = date.replaceAll("/", "-");
    const { data, isLoading, isError } = useQuery({
        queryKey: ['calendarDates', dateForApi],
        queryFn: () => getCalendarDate(dateForApi)
    });
    console.log(data)

    let dateContent: DateContent[] = [];
    if (data != undefined)
        dateContent = data.dateContent;
    else
        dateContent = []

    return (
        <Page>
            <section className="flex justify-center bg-background">
                <div className="w-1/2 bg-base-100 shadow-xl p-5">
                    <div className="flex justify-end">
                        <CloseBtn onClick={() => navigate("/calendar/month")} />
                    </div>
                    <div>
                        <WeekDay date={formatDate(new Date(date))} dateContent={dateContent} />
                    </div>
                </div>
            </section>
        </Page>
    )

}