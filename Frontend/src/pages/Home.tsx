import { format } from "date-fns";
import Page from "../components/Page";
import { formatDate, weekDays } from "../helpers/dateHelpers";
import WeekDay from "../components/weekDay/WeekDay";

export default function Home() {
    return (
        <Page>
            <section className="flex border border-black rounded-lg h-80 justify-around m-5">
                {weekDays.map(day =>
                    <WeekDay key={format(day, 'd')} date={formatDate(day)}/>
                    )}
            </section>
        </Page>
    )
}