import { Link } from "react-router-dom";
import { format } from "date-fns";
import { today } from "../../../helpers/dateHelpers";
import { DateContent } from "../Types";

type Props = {
    dateContent: DateContent[][];
    date: string;
    dateIndex: number;
}
export default function CalenderDate({ dateContent, date, dateIndex }: Props) {
    const border = today == date ? "border border-2 border-primary hover:border-primary" : "";
    const text = today == date ? "text-primary font-bold" : "";

    var appliedCourseIds: number[] = [];
    var appliedCourseColors: string[] = [];
    dateContent.forEach(dcArray => {
        dcArray.forEach(dc => {
            if (appliedCourseIds.filter(id => id == dc.appliedCourseId!).length == 0) {
                appliedCourseIds.push(dc.appliedCourseId!)
                appliedCourseColors.push(dc.color!)
            }
        });
    });
    appliedCourseIds = [...new Set(appliedCourseIds.map(item => item))];

    return (
        <>
            <Link to={`/calendar/day/date=${date}`}
                className={`${border} rounded-md hover:shadow-md mx-px w-1/7 h-28`}>
                <h1 className={`${text} text-center self-start mb-4 mt-2`}>
                    {format(date, 'd')}
                </h1>
                {appliedCourseColors.length > 0 && appliedCourseColors.map((color, appliedCourseIndex) =>
                    <>
                        {dateContent[dateIndex] && appliedCourseIds.length > 0 && dateContent[dateIndex].find(dc => dc.appliedCourseId == appliedCourseIds[appliedCourseIndex])
                            ? <div style={{ backgroundColor: color }} className="w-full h-2 mb-1"></div>
                            : <div className="w-full h-2 mb-1"></div>}
                    </>
                )}
            </Link>
        </>
    )
}