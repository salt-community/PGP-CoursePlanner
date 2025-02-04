import DayTable from "./DayTable"
import { CourseModuleType } from "../Types"

type Props = {
    module: CourseModuleType
}

export default function ModuleDetails({ module }: Props) {
    return (
        <div className="p-10">
            <div className="flex justify-between">
                <h3 className="text-3xl">{module.module.name}</h3>
                <div className="flex flex-col items-center">
                    <h3 className="text-2xl font-bold">{module.module.days.length}</h3>
                    <p>Days</p>
                </div>
            </div>
            {module.module.days.map((day, index) => (
                <div key={index}>
                    <h4 className="text-xl pb-1 pt-4" key={index}>Day {day.dayNumber}</h4>
                    <DayTable events={day.events} />
                </div>
            ))}
        </div>
    )
}