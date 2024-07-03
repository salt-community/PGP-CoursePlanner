import { useNavigate } from "react-router-dom";
import ModalCard from "../../components/ModalCard";
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
            <ModalCard
                button={
                    <CloseBtn onClick={() => navigate("/calendar/month")} />
                }
                content={
                    <WeekDay date={formatDate(new Date(date))} dateContent={dateContent} />
                }
            />
        </Page>
    )

}