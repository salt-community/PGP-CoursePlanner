import { format } from "date-fns";
import { today } from "../../helpers/dateHelpers";

type Props = {
    date: string;
}

export default function WeekDay({ date }: Props) {

    const color = today == date ? "border-orange-300" : "border-black";

    return (
        <article className={`border ${color} rounded-lg w-1/6 my-4 flex justify-center`}>
            <h1>{format(date, 'EEEE')}</h1>
        </article>

    )
}