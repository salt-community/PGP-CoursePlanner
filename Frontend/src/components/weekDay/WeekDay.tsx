import { format } from "date-fns";
import { DateContent } from "../calendar/Types";

type Props = {
    date: string;
    dateContent: DateContent[] | undefined
}

export default function WeekDay({ date, dateContent }: Props) {

    // export type DateContent = {
    //     id?: number
    //     moduleName?: string;
    //     dayOfModule: number;
    //     totalDaysInModule: number;
    //     courseName: string;
    //     events: EventType[]
    // }

    // const { data: calendarDate, isLoading, isError } = useQuery({
    //     queryKey: ['calendarDates', date],
    //     queryFn: () => getCalendarDate(date)
    // });

    // make links to course and module
    return (
        <div className={`rounded-lg my-4 flex flex-col justify-center w-full`}>
            <h1 className="mb-4 text-lg font-bold text-center">{format(date, 'EEEE')}</h1>
            {dateContent && dateContent.map(content =>
                <div className="border border-black rounded-lg m-2 p-2">
                    <h2 className="font-bold">{content.courseName}</h2>
                    <h3>Module: {content.moduleName} (day {content.dayOfModule}/{content.totalDaysInModule})</h3>
                    <h3>Events:</h3>
                    {content.events.length > 0 && content.events.map(eventItem =>
                        <h3 className="ml-4">{eventItem.name}: {eventItem.startTime}-{eventItem.endTime}</h3>
                    )}
                </div>
            )}
        </div>

    )
}