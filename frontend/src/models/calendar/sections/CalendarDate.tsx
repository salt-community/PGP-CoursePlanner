import { Link } from "react-router-dom";
import { format } from "date-fns";
import { today } from "@helpers/dateHelpers";
import { DateContent } from "../Types";

type Props = {
    dateContent: DateContent[];
    date: string;
}

export default function CalenderDate({ dateContent, date }: Props) {
    const border = today == date ? "border border-2 border-primary hover:border-primary" : "border";
    const text = today == date ? "text-primary font-bold" : "";

    const appliedCourseIds: number[] = [];
    const appliedCourseColors: string[] = [];
    const appliedModules: string[] = []
    dateContent.forEach(dc => {
        if (appliedCourseIds.filter(id => id == dc.appliedCourseId!).length == 0) {
            appliedCourseIds.push(dc.appliedCourseId!)
            appliedCourseColors.push(dc.color!)
            if (dc.moduleName != null) {
               
                if (dc.dayOfModule != 0) {
                    appliedModules.push(dc.moduleName! + `day (${dc.dayOfModule}/${dc.totalDaysInModule})`)
                }
                else {
                    appliedModules.push("Weekend")
                }
            }
        }
    });

    return (
        <>
            <Link to={`/calendar/day/date=${date}`}
            // todo: fix so that all cells are of equal height regardless of content.
                className={`${border}  hover:shadow-md  w-1/7 hover:italic h-full `}> 
                <h1 className={`${text} text-center self-start mb-1 mt-2`}>
                    {format(date, 'd')}
                </h1>
                {appliedCourseColors.length > 0 && appliedCourseColors.map((color, appliedCourseIndex) => (
                    <div
                        key={appliedCourseIndex}
                        style={{ backgroundColor: color }}
                        className="w-full h-7 mb-1 text-clip overflow-hidden whitespace-nowrap"
                    >
                        <p className="truncate">{appliedModules[appliedCourseIndex]}</p>
                    </div>
                ))}
            </Link>
        </>
    )
}