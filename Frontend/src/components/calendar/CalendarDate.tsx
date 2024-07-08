import { Link } from "react-router-dom";
import { today } from "../../helpers/dateHelpers";
import { format } from "date-fns";

type Props = {
    date: string;
}
export default function CalenderDate({ date }: Props) {
    const border = today == date ? "border border-orange-300 hover:border-orange-300" : "";

    return (
        <>
            <Link to={`/calendar/day/date=${date}`}
                className={`${border} rounded-md flex justify-center items-center hover:shadow-md mx-px w-1/7 h-16`}>
                {format(date, 'd')}
            </Link>
        </>
    )
}