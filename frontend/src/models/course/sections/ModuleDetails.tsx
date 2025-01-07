import { ModuleType } from "@models/module/Types"
import DayTable from "./DayTable"

type Props = {
    module: ModuleType
}


export default function ModuleDetails({ module }: Props) {

    return (
        <div className="p-12">
            <h3 className="text-3xl">{module.name}</h3>

            {module.days.map((day,index) => (
                <div className="overflow-scroll">
                <h4 className="text-xl pb-1 pt-4" key={index}>Day {day.dayNumber}</h4>
                <DayTable events={day.events} />
                </div>
            ))}
        </div>
    )

}