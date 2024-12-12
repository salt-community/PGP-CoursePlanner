import { getDateAsString, today, weekDays } from "@helpers/dateHelpers";
import WeekDay from "@models/calendar/sections/WeekDay";
import { CalendarDateType } from "@models/calendar/Types";
import { format, getWeek } from "date-fns";
import { Link } from "react-router-dom";
import { DayModal } from "./DayModal";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface CurrentWeekProps {
    data: CalendarDateType[] | undefined;
}

export default function CurrentWeek({ data }: CurrentWeekProps) {
    const thisWeek = getWeek(new Date());


    const renderSection = (day : Date , index : number, isToday : boolean) => {
        const commonClasses = "flex flex-col w-full gap-3";
        const borderClasses = isToday ? "border-2 border-primary" : "border border-black";
        const textClasses = isToday ? "text-xl font-bold text-primary" : "text-lg";
        const formattedDay = getDateAsString(day);
    
        return (
            <section key={format(day, 'd')} className={`${commonClasses} ${borderClasses}`} onClick={()=>document.getElementById(`${day.toDateString() + "_modal"}`)!.showModal()}>
                <DayModal popUpId={day.toDateString() + "_modal"}/>
                <Link to={`/calendar/day/date=${formattedDay}`} className="hover:-translate-y-0.5">
                    <h1 className={`item-center text-center ${textClasses}`}>
                        {format(formattedDay, 'EEEE')}<br />
                        {day.getDate()} {monthNames[day.getMonth()]}
                    </h1>
                </Link>
                {data && data[index] !== null ? <WeekDay dateContent={data[index].dateContent} /> : ""}
            </section>
        );
    };

    return (
        <section className="flex rounded-lg w-full justify-between m-5 p-5">
            <h2>{thisWeek}</h2>
            {weekDays.map((day, index) => renderSection(day, index, getDateAsString(day) === today))}
        </section>
    )
}