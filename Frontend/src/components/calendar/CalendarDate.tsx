import { Link } from "react-router-dom";
import { today } from "../../helpers/dateHelpers";
import { format } from "date-fns";

type Props = {
    date: string;
}
export default function CalenderDate({ date }: Props) {
    const border = today == date ? "border border-orange-300 hover:border-white" : "";

    return (
        <>
            <Link to={`/home/details/date=${date}`}
                className={`${border} flex justify-center items-center hover:shadow-md rounded-sm mx-px w-1/7`}>
                {format(date, 'd')}
            </Link>
        </>
    )
}