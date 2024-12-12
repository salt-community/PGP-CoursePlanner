import LoadingMessage from "@components/LoadingMessage"
import { getCookie } from "@helpers/cookieHelpers"
import { currentMonth, currentWeek, currentYear } from "@helpers/dateHelpers"
import { getWeek } from "date-fns"
import { Link } from "react-router-dom"
import CurrentWeek from "./CurrentWeek"
import NextWeek from "./NextWeek"
import { useQueryCalendarDateWeeks } from "@api/calendarDate/calendarDateQueries"

export default function WeeksContainer() {
    const nextWeek = new Date().setDate(new Date().getDate() + 7);

    console.log(getWeek(nextWeek))
    const { data, isLoading: isCalendarLoading } = useQueryCalendarDateWeeks(currentWeek);

    return (
        <section className="pl-20 pr-20 pb-20 flex flex-col items-center">
            <h2 className="text-2xl font-semibold">Current Week</h2>
            {isCalendarLoading || (!getCookie("JWT") || !getCookie("access_token"))
                ?
                <LoadingMessage />
                :
                <CurrentWeek data={data} />
            }
            <h2 className="text-2xl font-semibold">Next Week</h2>
            {isCalendarLoading || (!getCookie("JWT") || !getCookie("access_token"))
                ?
                <LoadingMessage />
                :
                <NextWeek data={data} />
            }
            <div className="flex flex-row gap-2">
                <Link to={`/calendar/month/monthyear=${currentMonth}-${currentYear}`} className="btn  btn-secondary">Go to calendar</Link>
                <Link to={`/calendar/timeline`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to timeline</Link>
            </div>
        </section>
    )
}