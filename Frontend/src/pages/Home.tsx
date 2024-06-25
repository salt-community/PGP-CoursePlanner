import { format } from "date-fns";
import Page from "../components/Page";
import { weekDays } from "../helpers/dateHelpers";

export default function Home() {
    return (
        <Page>
            <section className="flex border border-black rounded-lg h-80 justify-around m-5">
                {weekDays.map(day =>
                    <article key={format(day, 'EEEE')} className="border border-black rounded-lg w-40 my-4 flex justify-center">
                        <h1>{format(day, 'EEEE')}</h1>
                    </article>)}
            </section>
        </Page>
    )
}