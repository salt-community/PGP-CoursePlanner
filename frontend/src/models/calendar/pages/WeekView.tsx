import { format, getMonth, getWeek, getYear } from "date-fns";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import NextBtn from "@components/buttons/NextBtn";
import PreviousBtn from "@components/buttons/PreviousBtn";
import Page from "@components/Page";
import { fullWeekOfWeekNumber, getDateAsString } from "@helpers/dateHelpers";
import { useWeekFromPath, useYearFromPath } from "@helpers/helperHooks";
import WeekDayCalendar from "../sections/WeekDayCalendar";
import { useQueryCalendarDateBatch } from "@api/calendarDateQueries";

export default function MonthView() {
    const [week, setWeek] = useState<number>(parseInt(useWeekFromPath()));
    const [year, setYear] = useState<number>(parseInt(useYearFromPath()));
    const navigate = useNavigate();

    const allWeekDays = fullWeekOfWeekNumber(week, year);
    if (getWeek(allWeekDays[0], { weekStartsOn: 1, firstWeekContainsDate: 4 }) != week) {
        setWeek(getWeek(allWeekDays[0], { weekStartsOn: 1, firstWeekContainsDate: 4 }));
        if (getWeek(allWeekDays[0], { weekStartsOn: 1, firstWeekContainsDate: 4 }) > 50)
            setYear(getYear(allWeekDays[0]));
        else
            setYear(getYear(allWeekDays[6]));
    }
    const monthFirstDay = getMonth(allWeekDays[0]);
    const monthLastDay = getMonth(allWeekDays[6]);
    const yearFirstDay = getYear(allWeekDays[0])
    const yearLastDay = getYear(allWeekDays[6])

    const monday = getDateAsString(allWeekDays[0])
    const sunday = getDateAsString(allWeekDays[6])

    const {data, isPending, isError, error} = useQueryCalendarDateBatch(monday, sunday);

    if (isError) {
        console.log("Query error:", error);
    }
    if (isPending) return "pending"

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <Page>
            <section className="flex pb-10">
                <div className="flex w-1/6 justify-around">
                    <PreviousBtn onClick={() => { setWeek(week - 1); navigate(`/calendar/week/weeknumberyear=${week - 1}-${year}`); }} />
                </div>
                <div className="flex flex-col items-center w-4/6">
                    <header className="mt-5 mb-5">
                        {monthFirstDay == monthLastDay
                            ? <h1 className="text-3xl">
                                Week {week} ({monthNames[monthFirstDay]} {year})
                            </h1>
                            : <> {yearFirstDay == yearLastDay
                                ? <h1 className="text-3xl">
                                    Week {week} ({monthNames[monthFirstDay]}/{monthNames[monthLastDay]} {year})
                                </h1>
                                : <h1 className="text-3xl">
                                    Week {week} ({monthNames[monthFirstDay]} {yearFirstDay}/{monthNames[monthLastDay]} {yearLastDay})
                                </h1>
                            }
                            </>
                        }

                    </header>
                    <div className={`justify-center w-full shadow-xl drop-shadow-2xl break-normal grid grid-cols-7 rounded-md bg-white`}>
                        {allWeekDays.map(day => (
                            <div key={format(day, 'E')} className="h-28 w-1/7 flex items-center justify-center py-1 px-1 border-b-2 border-gray-100 border-3">{format(day, 'E')}</div>
                        ))}
                        {allWeekDays.map((thisDate, dateIndex) => {
                            return <div key={format(thisDate, 'yyyy-MM-dd')} className="flex flex-col">
                                {data && data[dateIndex] !== null ? <WeekDayCalendar dateContent={data[dateIndex].dateContent} key={format(thisDate, 'd')} date={getDateAsString(thisDate)} />
                                    : <WeekDayCalendar dateContent={[]} key={format(thisDate, 'd')} date={getDateAsString(thisDate)} />}
                            </div>
                        })
                        }
                        <div className="h-2"></div>
                    </div>
                    <div className="flex flex-row gap-2">
                        <Link to={`/calendar/month/monthyear=${getMonth(allWeekDays[0])}-${year}`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to month view</Link>
                        <Link to={`/calendar/timeline`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to timeline</Link>
                    </div>
                </div>
                <div className="flex w-1/6 justify-around">
                    <NextBtn onClick={() => { setWeek(week + 1); navigate(`/calendar/week/weeknumberyear=${week + 1}-${year}`); }} />
                </div>
            </section>
        </Page>
    )
}