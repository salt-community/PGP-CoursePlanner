import { getDateAsString, weekDaysNextWeek } from "@helpers/dateHelpers";
import WeekDay from "@models/calendar/sections/WeekDay";
import { CalendarDateType } from "@models/calendar/Types";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface NextWeekProps {
    data: CalendarDateType[] | undefined;
}

export default function CurrentNextWeeks({ data }: NextWeekProps) {
    return (
        <section className="flex rounded-lg w-full justify-between m-5 gap-3 p-3">
            {weekDaysNextWeek.map((day, index) =>

                <section key={format(day, 'd')} className="flex flex-col border border-black rounded-lg w-full gap-3">
                    <Link to={`/calendar/day/date=${getDateAsString(day)}`} className="hover:-translate-y-0.5">
                        <h1 className="item-center text-lg text-center">{format(getDateAsString(day), 'EEEE')}
                            <br /> {day.getDate()} {monthNames[day.getMonth()]}
                        </h1>
                    </Link>
                    {data && data[index + 7] !== null ? <WeekDay dateContent={data[index + 7].dateContent} /> : ""}
                </section>
            )}
        </section>
    )
}