import { format, getWeek, getYear } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import NextBtn from "../../../components/buttons/NextBtn";
import PreviousBtn from "../../../components/buttons/PreviousBtn";
import Page from "../../../components/Page";
import { currentWeek, currentYear, fullWeekOfWeekNumber, getDateAsString } from "../../../helpers/dateHelpers";
import { getWeekFromPath, getYearFromPath } from "../../../helpers/helperMethods";
import { getCookie } from "../../../helpers/cookieHelpers";
import Login from "../../login/Login";
import CalendarDate from "../sections/CalendarDate";
import { getCalendarDate } from "../../../api/CalendarDateApi";
import { DateContent } from "../Types";


export default function MonthView() {
    const [week, setWeek] = useState<number>(parseInt(getWeekFromPath()));
    const [year, setYear] = useState<number>(parseInt(getYearFromPath()));
    const navigate = useNavigate();

    const allWeekDays = fullWeekOfWeekNumber(week, year);
    console.log(allWeekDays)
    if (getWeek(allWeekDays[0]) != week) {
        setWeek(getWeek(allWeekDays[0]));
        setYear(getYear(allWeekDays[6]));
    }

    const [weekDayDateContent, setWeekDayDateContent] = useState<DateContent[][]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const promises = allWeekDays.map(day => {
                const dayString = getDateAsString(day).replaceAll("/", "-");
                const data = getCalendarDate(dayString);
                if (data != undefined)
                    return data
                else
                    return []
            });

            const results = await Promise.all(promises);
            const newWeekDayDateContent = results.map(result => result?.dateContent || []);
            setWeekDayDateContent(newWeekDayDateContent);
        };

        fetchData();
    }, [week]);

    return (
        getCookie("access_token") == undefined
            ? <Login />
            : <Page>
                <section className="flex pb-10">
                    <div className="flex w-1/6 justify-around">
                        <PreviousBtn onClick={() => { setWeek(week - 1); navigate(`/calendar/week/weeknumberyear=${week - 1}-${year}`);}} />
                    </div>
                    <div className="flex flex-col items-center w-4/6">
                        <header className="mt-5 mb-5">
                            <h1 className="text-3xl">
                                Week {week}
                            </h1>
                        </header>
                        <div className={`justify-center w-full shadow-xl drop-shadow-2xl break-normal grid grid-cols-7 grid-rows-2 rounded-md bg-white`}>
                            {allWeekDays.map(day => (
                                <div key={format(day, 'E')} className="h-16 w-1/7 flex items-center justify-center py-1 px-1 border-b-2 border-gray-100 border-3">{format(day, 'E')}</div>
                            ))}

                            {allWeekDays.map((thisDate, dateIndex) => {
                                return <CalendarDate dateContent={weekDayDateContent} dateIndex={dateIndex} key={format(thisDate, 'd')} date={getDateAsString(thisDate)} />
                            })
                            }
                        </div>
                        <div className="flex flex-row gap-2">
                            <Link to={`/calendar/month`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to month view</Link>
                            <Link to={`/calendar/timeline`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to timeline</Link>
                        </div>
                    </div>
                    <div className="flex w-1/6 justify-around">
                        <NextBtn onClick={() => { setWeek(week + 1); navigate(`/calendar/week/weeknumberyear=${week + 1}-${year}`);}} />
                    </div>
                </section>
            </Page>
    )
}