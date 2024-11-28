import { getCalendarDateWeeks } from "@api/CalendarDateApi"
import LoadingMessage from "@components/LoadingMessage"
import { getCookie } from "@helpers/cookieHelpers"
import { currentMonth, currentWeek, currentYear } from "@helpers/dateHelpers"
import { CalendarDateType } from "@models/calendar/Types"
import { useQuery } from "@tanstack/react-query"
import { getWeek } from "date-fns"
import { Link } from "react-router-dom"
import CurrentWeek from "./CurrentWeek"
import NextWeek from "./NextWeek"

export default function WeeksContainer() {
    const thisWeek = new Date();
    const nextWeek = new Date(thisWeek).setDate(thisWeek.getDate() + 7);

    const { data, isLoading: isCalendarLoading } = useQuery<CalendarDateType[]>({
        queryKey: ['CalendarWeeks'],
        queryFn: () => getCalendarDateWeeks(currentWeek),
        enabled: !!getCookie("JWT"),
    })

    return (
        <section className="pl-20 pr-20 pb-20 flex flex-col items-center">
            <h2 className="text-2xl font-semibold">Current Week {getWeek(new Date())}</h2>
            {isCalendarLoading || (!getCookie("JWT") || !getCookie("access_token"))
                ?
                <LoadingMessage />
                :
                <CurrentWeek data={data} />
            }
            <h2 className="text-2xl font-semibold">Next Week {getWeek(nextWeek)}</h2>
            {isCalendarLoading || (!getCookie("JWT") || !getCookie("access_token"))
                ?
                <LoadingMessage />
                :
                <NextWeek data={data} />
            }
            <div className="flex flex-row gap-2">
                <Link to={`/calendar/month/monthyear=${currentMonth}-${currentYear}`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to calendar</Link>
                <Link to={`/calendar/timeline`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to timeline</Link>
            </div>
        </section>
    )
}