import { format, getWeek } from "date-fns";
import Page from "../components/Page";
import { formatDate, weekDays } from "../helpers/dateHelpers";
import WeekDay from "../components/weekDay/WeekDay";

export default function Home() {
    return (
        <Page>
            <h1 className="text-2xl font-semibold">We Are In Week {getWeek(new Date())}</h1>
            <section className="flex border border-black rounded-lg h-80 justify-around m-5">
                {weekDays.map(day =>
                    <WeekDay key={format(day, 'd')} date={formatDate(day)}/>
                    )}
            </section>
        </Page>
    )
}