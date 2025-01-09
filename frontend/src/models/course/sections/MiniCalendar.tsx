import NextBtn from "@components/buttons/NextBtn"
import PreviousBtn from "@components/buttons/PreviousBtn"
import { useState } from "react"

import { firstDayOfMonth, allDaysInInterval, fullWeek, daysBeforeMonth, firstWeekDay, getDateAsString, lastDayOfMonth } from "../../../helpers/dateHelpers"
import { format, getMonth, getWeek, getYear } from "date-fns"
import { useQueryCalendarDateBatch } from "@api/calendarDate/calendarDateQueries"
import CalendarDate from "@models/calendar/sections/CalendarDate"
import { CourseType } from "../Types"
import { ModuleType } from "@models/module/Types"
import { calculateCourseDayDates } from "../helpers/courseUtils"

type Props = {
    startDate: Date
    course : CourseType
    modules : ModuleType[]
}

export default function MiniCalendar({ startDate, course, modules }: Props) {
    const [month, setMonth] = useState<number>(startDate.getMonth());
    const [year, setYear] = useState<number>(startDate.getFullYear());


    const startOfMonth = firstDayOfMonth(month, year);
    const endOfMonth = lastDayOfMonth(month, year);
    const daysInMonth = allDaysInInterval(startOfMonth, endOfMonth);
    const monthInText = format(new Date(year, month, 1), "MMMM");

    if (getMonth(startOfMonth) != month && getYear(endOfMonth) != year) {
        setMonth(getMonth(startOfMonth));
        setYear(getYear(endOfMonth));
    }

    const numberOfWeeks = getWeek(endOfMonth) - getWeek(startOfMonth) + 1;
    const numberOfRows = "grid-rows-" + (numberOfWeeks + 1).toString();

    const startOfMonth2 = getDateAsString(startOfMonth);
    const endOfMonth2 = getDateAsString(endOfMonth);

    const { data, isPending, isError, error } = useQueryCalendarDateBatch(startOfMonth2, endOfMonth2);

    const initialCalendarDays = calculateCourseDayDates(course, modules, startDate )
    // console.log(initialCalendarDays)


    if (isError) {
        console.log("Query error:", error);
    }
    if (isPending) return "pending";

    return (
        <div className="flex flex-col h-full">
            <header className="flex mb-0 p-0 items-center gap-2">
                <div className="flex items-center">
                    <PreviousBtn onClick={() => { setMonth(month - 1); }} />
                    <NextBtn onClick={() => { setMonth(month + 1); }} />
                </div>
                <h1 className="text-3xl">{monthInText} {year}</h1>
            </header>

            <section className="flex-grow flex py-2">
                <div className="flex flex-col items-center w-full h-full">
                    <div className={`w-full flex-grow   grid grid-cols-7 ${numberOfRows} rounded-md bg-white`}>
                        {fullWeek.map(day => (
                            <div key={format(day, 'E')} className="w-1/7 flex justify-center items-center p-1 border-b-2 border-gray-100">
                                {format(day, 'E')}
                            </div>
                        ))}
                        {daysBeforeMonth(startOfMonth, firstWeekDay(startOfMonth)).map((emptyDayIndex) => (
                            <div key={format(emptyDayIndex, 'd')} className="w-1/7 h-full"></div>
                        ))}
                        {daysInMonth.map((thisDate, dateIndex) => {
                            // if(initialCalendarDays.map(d =>d.date).includes(thisDate)) console.log("hejehejehejehejehjjjjjjjjjjjjjjjj XDDD")

                            return (
                                <div key={format(thisDate, 'yyyy-MM-dd')} className="flex flex-col">
                                    {data && data[dateIndex] !== null ? (
                                        <CalendarDate openModal={() => null} indexForModal={dateIndex} dateContent={data[dateIndex].dateContent} key={format(thisDate, 'd')} date={getDateAsString(thisDate)} />
                                    ) : (
                                        <CalendarDate openModal={() => null} indexForModal={dateIndex} dateContent={[]} key={format(thisDate, 'd')} date={getDateAsString(thisDate)} />
                                    )}

                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );

}