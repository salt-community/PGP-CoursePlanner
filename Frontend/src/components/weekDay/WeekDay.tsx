import { format } from "date-fns";
import { today } from "../../helpers/dateHelpers";

type Props = {
    date: string;
}

export default function WeekDay({ date }: Props) {

    const color = today == date ? "orange" : "black";

    console.log(date + " : " + color);
    console.log("Today = ", today);
    return (
        <article className={`border border-${color} rounded-lg w-40 my-4 flex justify-center`}>
            <h1>{format(date, 'EEEE')}</h1>
        </article>

    )
}