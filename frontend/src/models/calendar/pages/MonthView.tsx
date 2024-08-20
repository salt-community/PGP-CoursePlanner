import NextBtn from "../../../components/buttons/NextBtn"
import PreviousBtn from "../../../components/buttons/PreviousBtn"
import Page from "../../../components/Page"
import { useEffect, useState } from "react"
import CalendarDate from "../sections/CalendarDate"
import { Link, useNavigate } from "react-router-dom"
import { currentMonth, firstDayOfMonth, allDaysInInterval, currentYear, fullWeek, daysBeforeMonth, firstWeekDay, getDateAsString, lastDayOfMonth, today } from "../../../helpers/dateHelpers"
import { format, getMonth, getWeek, getYear } from "date-fns"
import { getCookie } from "../../../helpers/cookieHelpers"
import Login from "../../login/Login"
import { DateContent } from "../Types"
import { getCalendarDate } from "../../../api/CalendarDateApi"
import { getMonthFromPath, getYearFromPath } from "../../../helpers/helperMethods"

export default function MonthView() {
    const [month, setMonth] = useState<number>(parseInt(getMonthFromPath()));
    const [year, setYear] = useState<number>(parseInt(getYearFromPath()));
    const navigate = useNavigate();

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

    const [weekDayDateContent, setWeekDayDateContent] = useState<DateContent[][]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const results = await Promise.all(daysInMonth.map(async day => {
                const dayString = getDateAsString(day).replaceAll("/", "-");
                console.log(dayString)
                const data = await getCalendarDate(dayString);
                if (data != undefined) {
                    return data}
                else
                    return []
            }));

            console.log("results", results) // this gives the first promise as undefined and does not get the last one
            const newWeekDayDateContent = results.map(result => result?.dateContent || []);
            setWeekDayDateContent(newWeekDayDateContent);
        };

        fetchData();
    }, [month]);

    return (
        getCookie("access_token") == undefined
            ? <Login />
            : <Page>
                <section className="flex pb-10">
                    <div className="flex w-1/6 justify-around">
                        <PreviousBtn onClick={() => { setMonth(month - 1); navigate(`/calendar/month/monthyear=${month - 1}-${year}`); }} />
                    </div>
                    <div className="flex flex-col items-center w-4/6">
                        <header className="mt-5 mb-5">
                            <h1 className="text-3xl">
                                {monthInText} {year}
                            </h1>
                        </header>
                        <div className={`justify-center w-full shadow-xl drop-shadow-2xl break-normal grid grid-cols-7 ${numberOfRows} rounded-md bg-white`}>
                            {fullWeek.map(day => (
                                <div key={format(day, 'E')} className="h-24 w-1/7 flex items-center justify-center py-1 px-1 border-b-2 border-gray-100 border-3">{format(day, 'E')}</div>
                            ))}
                            {daysBeforeMonth(startOfMonth, firstWeekDay(startOfMonth)).map((emptyDayIndex) => (
                                <div key={format(emptyDayIndex, 'd')} className="w-1/7 h-24"></div>
                            ))}
                            {daysInMonth.map((thisDate, dateIndex) => {
                                return <div className="flex flex-col">
                                    <CalendarDate dateContent={weekDayDateContent} dateIndex={dateIndex} key={format(thisDate, 'd')} date={getDateAsString(thisDate)} />
                                </div>
                            })
                            }
                        </div>
                        <div className="flex flex-row gap-2">
                            {currentMonth == month && currentYear == year
                                ? <Link to={`/calendar/week/weeknumberyear=${getWeek(today)}-${year}`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to week view</Link>
                                : <>{startOfMonth.getDay() == 0
                                    ? <Link to={`/calendar/week/weeknumberyear=${getWeek(startOfMonth) - 1}-${year}`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to week view</Link>
                                    : <Link to={`/calendar/week/weeknumberyear=${getWeek(startOfMonth)}-${year}`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to week view</Link>
                                }
                            </>}
                            <Link to={`/calendar/timeline`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to timeline</Link>
                        </div>
                    </div>
                    <div className="flex w-1/6 justify-around">
                        <NextBtn onClick={() => { setMonth(month + 1); navigate(`/calendar/month/monthyear=${month + 1}-${year}`); }} />
                    </div>
                </section>
            </Page>
    )
}