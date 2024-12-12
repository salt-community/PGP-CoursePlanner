import { getDateAsString, today, weekDays } from "@helpers/dateHelpers";
import WeekDay from "@models/calendar/sections/WeekDay";
import { CalendarDateType } from "@models/calendar/Types";
import { format, getWeek, setDate } from "date-fns";
import { DayModal } from "./DayModal";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface WeekProps {
    data: CalendarDateType[] | undefined;
    isNextWeek: boolean
}

export default function Week({ data, isNextWeek }: WeekProps) {
    const thisWeek = getWeek(new Date());
    const nextWeek = getWeek(new Date().setDate(new Date().getDate() +7))




    const renderSection = (day: Date, index: number, isToday: boolean) => {
        if (isNextWeek) {
            index += 7;
            const weekAheadDay = new Date(day)
            weekAheadDay.setDate(day.getDate() +7 )
            day = weekAheadDay
            isToday = false
        }
        const commonClasses = "flex flex-col w-full gap-3 p-3";
        const borderClasses = isToday ? "border-2 border-primary" : "border-l border-accent";
        const backgroundClasses = "bg-white"
        const textClasses = isToday ? "text-xl font-bold text-primary" : "text-lg";
        const formattedDay = getDateAsString(day);

        return (
            <section key={format(day, 'd')} className={`${commonClasses} ${borderClasses} ${backgroundClasses} `} onClick={() => document.getElementById(`${day.toDateString() + "_modal"}`)!.showModal()}>
                <DayModal popUpId={day.toDateString() + "_modal"} />

                <h1 className={`item-center text-center ${textClasses}`}>
                    {format(formattedDay, 'EEEE')}<br />
                    {day.getDate()} {monthNames[day.getMonth()]}
                </h1>
                {data && data[index] !== null ? <WeekDay dateContent={data[index].dateContent} /> : ""}
            </section>
        );
    };

    return (
        <section className="flex w-full justify-between m-5  rounded-xl bg-accent overflow-hidden drop-shadow-xl">
            <p className="p-1">{!isNextWeek ?  thisWeek : nextWeek }</p>
            {weekDays.map((day, index) => renderSection(day, index, getDateAsString(day) === today))}

        </section>
    )
}