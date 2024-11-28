import { getDateAsString, today, weekDays } from "@helpers/dateHelpers";
import WeekDay from "@models/calendar/sections/WeekDay";
import { CalendarDateType } from "@models/calendar/Types";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface CurrentWeekProps {
    data: CalendarDateType[] | undefined;
}

export default function CurrentWeek({ data }: CurrentWeekProps) {
    return (
        <section className="flex rounded-lg w-full justify-between m-5 gap-3 p-5">
            {weekDays.map((day, index) =>
                getDateAsString(day) == today
                    ? (
                        <section key={format(day, 'd')} className="flex flex-col border-2 border-primary rounded-lg w-full gap-3">
                            <Link to={`/calendar/day/date=${getDateAsString(day)}`} className="hover:-translate-y-0.5">
                                <h1 className="item-center text-xl font-bold text-center text-primary">{format(getDateAsString(day), 'EEEE')}
                                    <br /> {day.getDate()} {monthNames[day.getMonth()]}
                                </h1>
                            </Link>
                            {data && data[index] !== null ? <WeekDay dateContent={data[index].dateContent} /> : ""}
                        </section>
                    ) : (<section key={format(day, 'd')} className="flex flex-col border border-black rounded-lg w-full gap-3">
                        <Link to={`/calendar/day/date=${getDateAsString(day)}`} className="hover:-translate-y-0.5">
                            <h1 className="item-center text-lg text-center">{format(getDateAsString(day), 'EEEE')}
                                <br /> {day.getDate()} {monthNames[day.getMonth()]}
                            </h1>
                        </Link>
                        {data && data[index] !== null ? <WeekDay dateContent={data[index].dateContent} /> : ""}
                    </section>
                    ))}
        </section>
    )
}