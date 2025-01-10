import { currentWeek } from "@helpers/dateHelpers"
import { useQueryCalendarDateWeeks } from "@api/calendarDate/calendarDateQueries"
import Week from "./Week"
import Header from "@components/Header"
import ErrorModal from "@components/ErrorModal";

export default function WeeksContainer() {

    const { data, isLoading: isCalendarLoading, isError } = useQueryCalendarDateWeeks(currentWeek);

    return (
        <>
            <Header>
                <h2 className="text-3xl font-semibold">Current Week</h2>
                <div className="flex-grow"></div>
                <div className="flex items-center gap-2 mr-4">
                    <label>Filter Tracks</label>
                    <select className="select select-bordered select-sm max-w-xs">
                        <option disabled selected>All</option>
                        <option>Option</option>
                        <option>Option</option>
                    </select>
                </div>
            </Header>
            <section className="pl-10 pr-10 pb-4 flex flex-col items-center">
                <Week data={data} isNextWeek={false} isCalendarLoading={isCalendarLoading} />
                <h2 className="self-start text-3xl font-semibold mt-4 mb-5">Next Week</h2>
                <Week data={data} isNextWeek={true} isCalendarLoading={isCalendarLoading} />
            </section>
            {!isError && <ErrorModal error="Weeks" />}
        </>
    )
}