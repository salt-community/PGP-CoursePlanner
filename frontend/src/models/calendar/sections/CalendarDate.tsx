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
    const appliedModules : string[] = []
    dateContent.forEach(dc => {
            if (appliedCourseIds.filter(id => id == dc.appliedCourseId!).length == 0) {
                appliedCourseIds.push(dc.appliedCourseId!)
                appliedCourseColors.push(dc.color!)
                if(dc.moduleName != null) appliedModules.push( dc.moduleName! + `day (${dc.dayOfModule}/${dc.totalDaysInModule})`)
            }
        });
    
    //appliedCourseIds = [...new Set(appliedCourseIds.map(item => item))];

    return (
        <>
            <Link to={`/calendar/day/date=${date}`}
                className={`${border} rounded-md hover:shadow-md mx-px w-1/7 h-full hover:italic`}>
                <h1 className={`${text} text-center self-start mb-1 mt-2`}>
                    {format(date, 'd')}
                </h1>
                {appliedCourseColors.length > 0 && appliedCourseColors.map((color, appliedCourseIndex) => (
                <div
                    key={appliedCourseIndex} 
                    style={{ backgroundColor: color }}
                    className="w-full h-7 mb-1"
                >
                    <p>{appliedModules[appliedCourseIndex]}</p>
                </div>
                ))}
            </Link>
        </>
    )
}