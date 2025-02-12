import { ModuleType } from "@models/course/Types";
import DayTable from "./DayTable"
import { CourseType } from "../Types";
import PDFDownloadBtn from "@components/buttons/PDFDownloadBtn";

type Props = {
    module: ModuleType
    course: CourseType
}
const dayNamesLong = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function ModuleOverview({ module, course }: Props) {
    return (
        <>
            <div id={module.name + module.id} className="flex justify-between overflow-auto pt-10">
                <div className="flex gap-2">
                    <h3 className="text-3xl">{module.name}</h3>
                    {course.isApplied &&
                        <PDFDownloadBtn course={course} module={module} color="#000" size="size-8" />
                    }
                </div>
                <div className="flex flex-col items-center">
                    <h3 className="text-2xl font-bold">{module.days.length}</h3>
                    <p>Days</p>
                </div>
            </div>
            {module.days.map((day, index) => {
                const date = new Date(day.date);
                return (
                    <div key={index}>
                        {module.isApplied ?
                            <h4 className="text-xl pb-1 pt-4">{dayNamesLong[day.dayNumber - 1]} {date.toUTCString().slice(4, 11)}</h4>
                            :
                            <h4 className="text-xl pb-1 pt-4">Day {day.dayNumber}: {dayNamesLong[day.dayNumber - 1]}</h4>
                        }
                        <DayTable events={day.events} />
                    </div>
                )
            })}
        </>
    )
}