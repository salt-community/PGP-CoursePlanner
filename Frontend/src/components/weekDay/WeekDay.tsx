import { format } from "date-fns";
import { today } from "../../helpers/dateHelpers";
import { Link } from "react-router-dom";

type Props = {
    date: string;
}

export default function WeekDay({ date }: Props) {

    const color = today == date ? "border-orange-300" : "border-black";

    console.log(date + " : " + color);
    console.log("Today = ", today);
    return (
        <Link to={`details/${date}`} className={`border ${color} rounded-lg w-40 my-4 flex justify-center`}>
            <h1>{format(date, 'EEEE')}</h1>
        </Link>

    )
}