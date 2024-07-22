import NextBtn from "../../../components/buttons/NextBtn"
import PreviousBtn from "../../../components/buttons/PreviousBtn"
import Page from "../../../components/Page"
import { useState } from "react"
import CalendarDate from "../sections/CalendarDate"
import { Link } from "react-router-dom"
import { currentMonth, firstDayOfMonth, allDaysInMonth, currentYear, fullWeek, daysBeforeMonth, firstWeekDay, getDateAsString, lastDayOfMonth } from "../../../helpers/dateHelpers"
import { format, getWeek } from "date-fns"
import { getCookie } from "../../../helpers/cookieHelpers"
import NavigateToLogin from "../../login/NavigateToLogin"

export default function MonthView() {
    const [month, setMonth] = useState<number>(currentMonth);

    const startOfMonth = firstDayOfMonth(month);
    const endOfMonth = lastDayOfMonth(month);
    const daysInMonth = allDaysInMonth(startOfMonth, endOfMonth);
    const monthInText = format(new Date(currentYear, month, 1), "MMMM");

    const numberOfWeeks = getWeek(endOfMonth) - getWeek(startOfMonth) + 1;
    const numberOfRows = "grid-rows-" + (numberOfWeeks + 1).toString();

    return (
        getCookie("access_token") == undefined ?
            <NavigateToLogin />
            :
            <Page>
                <section className="flex justify-around items-center">
                    <PreviousBtn onClick={() => setMonth(month - 1)} />
                    <div className="flex flex-col items-center w-1/2">
                        <header className="mt-5 mb-5">
                            <h1 className="text-3xl">
                                {monthInText}
                            </h1>
                        </header>
                        <div className={`justify-center w-full shadow-xl drop-shadow-2xl break-normal grid grid-cols-7 ${numberOfRows} rounded-md bg-white lg:w-3/5`}>
                            {fullWeek.map(day => (
                                <div key={format(day, 'E')} className="h-16 w-1/7 flex items-center justify-center py-1 px-1 border-b-2 border-gray-100 border-3">{format(day, 'E')}</div>
                            ))}
                            {daysBeforeMonth(startOfMonth, firstWeekDay(startOfMonth)).map((emptyDayIndex) => (
                                <button key={format(emptyDayIndex, 'd')} className="w-1/7 h-16"></button>
                            ))}

                            {daysInMonth.map((thisDate) => {
                                return <CalendarDate key={format(thisDate, 'd')} date={getDateAsString(thisDate)} />
                            })
                            }
                        </div>
                        <div className="flex flex-row gap-2">
                            <Link to={`/calendar/week/weeknumber=${getWeek(startOfMonth)}`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to week view</Link>
                            <Link to={`/calendar/timeline`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to timeline</Link>
                        </div>
                    </div>
                    <NextBtn onClick={() => setMonth(month + 1)} />
                </section>
            </Page>
    )
}