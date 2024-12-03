import { useNavigate } from "react-router-dom";
import CloseBtn from "@components/buttons/CloseBtn";
import Page from "@components/Page";
import { format } from "date-fns";
import NextBtn from "@components/buttons/NextBtn";
import PreviousBtn from "@components/buttons/PreviousBtn";
import { DateContent } from "../Types";
import { useDateFromPath } from "@helpers/helperHooks";
import WeekDay from "../sections/WeekDay";
import { getDateAsString } from "@helpers/dateHelpers";
import { useQueryCalendarDate } from "@api/calendarDateQueries";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function DayDetails() {
    const navigate = useNavigate();
    const date = useDateFromPath();
    const dateAsDate = new Date(date);
    const dateForApi = date.replaceAll("/", "-");
    const { data } = useQueryCalendarDate(dateForApi);

    let nextDate = new Date(dateAsDate)
    nextDate = new Date(nextDate.setDate(nextDate.getDate() + 1));
    const nextDay = getDateAsString(nextDate);

    let previousDate = new Date(dateAsDate)
    previousDate = new Date(previousDate.setDate(previousDate.getDate() - 1));
    const previousDay = getDateAsString(previousDate)

    const dateContent: DateContent[] = data != undefined ? data.dateContent : [];

    return (
        <Page>
            <section className="flex justify-around">
                <PreviousBtn onClick={() => navigate("/calendar/day/date=" + previousDay)} />
                <section className="w-1/2 flex justify-center bg-background">
                    <div className="w-full bg-base-100 shadow-xl p-5">
                        <div className="flex justify-end">
                            <CloseBtn onClick={() => navigate(-1)} />
                        </div>
                        <h1 className="mb-4 item-center text-xl font-bold text-center">{format(getDateAsString(dateAsDate), 'EEEE')}
                            <br /> {dateAsDate.getDate()} {monthNames[dateAsDate.getMonth()]}
                        </h1>
                        <div>
                            <WeekDay dateContent={dateContent} />
                        </div>
                    </div>
                </section>
                <NextBtn onClick={() => navigate("/calendar/day/date=" + nextDay)} />
            </section>
        </Page >
    )
}