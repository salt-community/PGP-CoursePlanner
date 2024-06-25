import Page from "../components/Page";
import { weekDays } from "../helpers/dateHelpers";

export default function Home() {
    return (
        <Page>
            <section className="flex border border-black rounded-lg h-80 justify-around m-5">
                {weekDays.map(day =>
                    <article key={day} className="border border-black rounded-lg w-40 my-4 flex justify-center">
                        <h1>{day}</h1>
                    </article>)}
            </section>
        </Page>
    )
}