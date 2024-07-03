import { format, getWeek } from "date-fns";
import Page from "../../sections/Page";
import { formatDate, today, weekDays } from "../../helpers/dateHelpers";
import WeekDay from "../../components/weekDay/WeekDay";
import { getCalendarDate } from "../../api/CalendarDateApi";
import { useQuery } from "react-query";
import { DateContent } from "../../components/calendar/Types";

export default function Home() {

    const weekDayDateContent: DateContent[][] = [];
    weekDays.forEach(day => {
        const dayString = formatDate(day).replaceAll("/", "-");
        console.log(dayString)
        const { data, isLoading, isError } = useQuery({
            queryKey: ['calendarDates', dayString],
            queryFn: () => getCalendarDate(dayString)
        });
        if (data != undefined)
            weekDayDateContent.push(data.dateContent);
        else
            weekDayDateContent.push([]);
    });

    return (
        <Page>
            <section className="p-20 flex flex-col items-center">
                <h1 className="text-2xl font-semibold">We are in week {getWeek(new Date())}</h1>
                <section className="flex border border-black rounded-lg w-full h-full justify-between m-5 gap-3 p-3">
                    {weekDays.map((day, index) =>
                        <>
                            {formatDate(day) == today
                                ?
                                <section className="flex border border-orange-300 border-2 rounded-lg h-80 w-full justify-around gap-3">
                                    <WeekDay key={format(day, 'd')} date={formatDate(day)} dateContent={weekDayDateContent[index]} />
                                </section>
                                : <section className="flex border border-black rounded-lg h-80 w-full justify-around gap-3">
                                    <WeekDay key={format(day, 'd')} date={formatDate(day)} dateContent={weekDayDateContent[index]} />
                                </section>
                            }
                        </>
                    )}
                </section>
            </section>
        </Page>
    )
}