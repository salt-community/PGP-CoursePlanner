import LoadingMessage from "@components/LoadingMessage"
import { getCookie } from "@helpers/cookieHelpers"
import { currentWeek} from "@helpers/dateHelpers"
import { useQueryCalendarDateWeeks } from "@api/calendarDate/calendarDateQueries"
import Week from "./Week"

export default function WeeksContainer() {

    const { data, isLoading: isCalendarLoading } = useQueryCalendarDateWeeks(currentWeek);

    return (
        <section className="pl-10 pr-10 pb-4 pt-6 flex flex-col items-center">
            <h2 className="self-start text-3xl font-semibold mb-2">Current Week</h2>
            {isCalendarLoading || (!getCookie("JWT") || !getCookie("access_token"))
                ?
                <LoadingMessage />
                :
                <Week data={data} isNextWeek={false} />
            }
            <h2 className="self-start text-3xl font-semibold mb-2 mt-4">Next Week</h2>
            {isCalendarLoading || (!getCookie("JWT") || !getCookie("access_token"))
                ?
                <LoadingMessage />
                :
                <Week data={data} isNextWeek={true} />
            }
        </section>
    )
}