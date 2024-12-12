import LoadingMessage from "@components/LoadingMessage"
import { getCookie } from "@helpers/cookieHelpers"
import { currentMonth, currentWeek, currentYear } from "@helpers/dateHelpers"
import { Link } from "react-router-dom"
import { useQueryCalendarDateWeeks } from "@api/calendarDate/calendarDateQueries"
import Week from "./Week"

export default function WeeksContainer() {

    const { data, isLoading: isCalendarLoading } = useQueryCalendarDateWeeks(currentWeek);

    return (
        <section className="pl-20 pr-20 pb-20 flex flex-col items-center">
            <h2 className="text-2xl font-semibold">Current Week</h2>
            {isCalendarLoading || (!getCookie("JWT") || !getCookie("access_token"))
                ?
                <LoadingMessage />
                :
                <Week data={data} isNextWeek={false} />
            }
            <h2 className="text-2xl font-semibold">Next Week</h2>
            {isCalendarLoading || (!getCookie("JWT") || !getCookie("access_token"))
                ?
                <LoadingMessage />
                :
                <Week data={data} isNextWeek={true} />
            }
            <div className="flex flex-row gap-2">
                <Link to={`/calendar/month/monthyear=${currentMonth}-${currentYear}`} className="btn  btn-secondary">Go to calendar</Link>
                <Link to={`/calendar/timeline`} className="btn btn-secondary">Go to timeline</Link>
            </div>
        </section>
    )
}