import NextBtn from "@components/buttons/NextBtn"
import PreviousBtn from "@components/buttons/PreviousBtn"
import Page from "@components/Page"
import { useState } from "react"
import CalendarDate from "../sections/CalendarDate"
import {  useNavigate } from "react-router-dom"
import { firstDayOfMonth, allDaysInInterval,  fullWeek, daysBeforeMonth, firstWeekDay, getDateAsString, lastDayOfMonth } from "../../../helpers/dateHelpers"
import { format, getMonth, getWeek, getYear } from "date-fns"
import { useMonthFromPath, useYearFromPath } from "@helpers/helperHooks"
import { useQueryCalendarDateBatch } from "@api/calendarDate/calendarDateQueries"
import { trackUrl } from "@helpers/helperMethods"

export default function MonthView() {
    const [month, setMonth] = useState<number>(parseInt(useMonthFromPath()));
    const [year, setYear] = useState<number>(parseInt(useYearFromPath()));
    const navigate = useNavigate();
    trackUrl();

    const startOfMonth = firstDayOfMonth(month, year);
    const endOfMonth = lastDayOfMonth(month, year);
    const daysInMonth = allDaysInInterval(startOfMonth, endOfMonth);
    const monthInText = format(new Date(year, month, 1), "MMMM");

    if (getMonth(startOfMonth) != month && getYear(endOfMonth) != year) {
        setMonth(getMonth(startOfMonth));
        setYear(getYear(endOfMonth));
    }

    const numberOfWeeks = getWeek(endOfMonth) - getWeek(startOfMonth) + 1;
    const numberOfRows = "grid-rows-" + (numberOfWeeks +1).toString();

    const startOfMonth2 = getDateAsString(startOfMonth);
    const endOfMonth2 = getDateAsString(endOfMonth);

    const { data, isPending, isError, error } = useQueryCalendarDateBatch(startOfMonth2, endOfMonth2);

    if (isError) {
        console.log("Query error:", error);
    }
    if (isPending) return "pending";

    return (
        <Page >
            <header className="flex mb-0 p-0 items-center gap-2">
                <div className="flex items-center">
                    <PreviousBtn onClick={() => { setMonth(month - 1); navigate(`/calendar/month/monthyear=${month - 1}-${year}`); }} />
                    <NextBtn onClick={() => { setMonth(month + 1); navigate(`/calendar/month/monthyear=${month + 1}-${year}`); }} />
                </div>
                <h1 className="text-3xl">{monthInText} {year}</h1>
                <select className="select select-bordered select-sm max-w-xs ">
                    <option disabled selected>Month</option>
                    <option>Han Solo</option>
                    <option>Greedo</option>
                </select>
                <label> Filter Tracks</label>
                <select className="select select-bordered select-sm max-w-xs">
                    <option disabled selected>All</option>
                    <option>Han Solo</option>
                    <option>Greedo</option>
                </select>
            </header>

            <section className="flex py-2 flex-grow">
                <div className="flex flex-col items-center w-full h-full">
                    <div className={` w-full flex-grow shadow-xl drop-shadow-2xl break-normal grid grid-cols-7 ${numberOfRows} rounded-md bg-white`}> 
                        {fullWeek.map(day => (
                            <div key={format(day, 'E')} className="w-1/7 flex justify-center items-center p-1 border-b-2 border-gray-100 ">{format(day, 'E')}</div>
                        ))}
                        {daysBeforeMonth(startOfMonth, firstWeekDay(startOfMonth)).map((emptyDayIndex) => (
                            <div key={format(emptyDayIndex, 'd')} className="w-1/7 h-full"></div>
                        ))}
                        {daysInMonth.map((thisDate, dateIndex) => {
                            return <div key={format(thisDate, 'yyyy-MM-dd')} className="flex flex-col">
                                {data && data[dateIndex] !== null ? <CalendarDate dateContent={data[dateIndex].dateContent} key={format(thisDate, 'd')} date={getDateAsString(thisDate)} />
                                    : <CalendarDate dateContent={[]} key={format(thisDate, 'd')} date={getDateAsString(thisDate)} />}
                            </div>
                        })}
                    </div>
                </div>
            </section>
        </Page>
    )
}