import { useNavigate } from "react-router-dom";
import CloseBtn from "../../../components/buttons/CloseBtn";
import Page from "../../../components/Page";
import { format } from "date-fns";
import NextBtn from "../../../components/buttons/NextBtn";
import PreviousBtn from "../../../components/buttons/PreviousBtn";
import { useEffect, useState } from "react";
import { CalendarDateType, DateContent } from "../Types";
import { getCalendarDate } from "../../../api/CalendarDateApi";
import { getDateFromPath } from "../../../helpers/helperMethods";
import WeekDay from "../sections/WeekDay";
import { getDateAsString } from "../../../helpers/dateHelpers";

export default function DayDetails() {
    const navigate = useNavigate();
    const date = getDateFromPath();

    const dateAsDate = new Date(date);

    var nextDate = new Date(dateAsDate)
    nextDate = new Date(nextDate.setDate(nextDate.getDate() + 1));
    const nextDay = getDateAsString(nextDate);

    var previousDate = new Date(dateAsDate)
    previousDate = new Date(previousDate.setDate(previousDate.getDate() - 1));
    const previousDay = getDateAsString(previousDate)

    const dateForApi = date.replaceAll("/", "-");
    const [data, setData] = useState<CalendarDateType>();
    useEffect(() => {
        getCalendarDate(dateForApi)
            .then(setData);
    }, [dateForApi]);

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
                    <PreviousBtn onClick={() => navigate("/calendar/day/date=" + previousDay)} />
                </div>
                <section className="w-1/2 flex justify-center bg-background">
                    <div className="w-full bg-base-100 shadow-xl p-5">
                        <div className="flex justify-end">
                            <CloseBtn onClick={() => navigate("/calendar/month")} />
                        </div>
                        <h1 className="mb-4 item-center text-xl font-bold text-center">{format(getDateAsString(dateAsDate), 'EEEE')}
                            <br /> {dateAsDate.getDate()} {monthNames[dateAsDate.getMonth()]}
                        </h1>
                        <div>
                            <WeekDay dateContent={dateContent} />
                        </div>
                    </div>
                </section>
                <div className="h-[100px] flex items-end">
                    <NextBtn onClick={() => navigate("/calendar/day/date=" + nextDay)} />
                </div>
                <div></div>
            </section>
        </Page>
    )

}