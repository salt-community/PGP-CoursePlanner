import InputSmall from "@components/inputFields/InputSmall";
import PrimaryBtn from "@components/buttons/PrimaryBtn";
import SuccessBtn from "@components/buttons/SuccessBtn";
import { useState, FormEvent } from "react";
import { AppliedModuleProps } from '../Types';
import AppliedDay from "./AppliedDay";
import { DayType, EventType, ModuleType } from "../../module/Types";

export default function AppliedModule({ saveAppliedModule, module, index, buttonText }: AppliedModuleProps) {
    const [moduleName, setModuleName] = useState<string>(module.name);
    const [numOfDays, setNumOfDays] = useState<number>(module.days.length);
    const [days, setDays] = useState<DayType[]>(module.days);
    const [isIncompleteInput, setIsIncompleteInput] = useState<boolean>(false);

    const handleDays = () => {
        const editedDays = days.slice();
        if (numOfDays < days.length) {
            editedDays.splice(numOfDays, days.length - numOfDays);
        }

        else {
            const numOfDaysArray = ([...Array(numOfDays - days.length).keys()].map(i => i + 1));

            numOfDaysArray.map((num) => {
                const newDay = {
                    dayNumber: num + days.length,
                    description: "",
                    events: []
                };

                editedDays.push(newDay)
            })

        }
        setDays(editedDays);
    }

    const collapseToggle: HTMLInputElement | null = document.getElementById("collapse-toggle-" + index) as HTMLInputElement;
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { moduleName } = e.target as typeof e.target & { moduleName: { value: string } };
        const { numberOfDays } = e.target as typeof e.target & { numberOfDays: { value: number } };
        const events: EventType[] = [];
        days.forEach(day => {
            const eventsOfDay = day.events;
            eventsOfDay.forEach(event => {
                events.push(event);
            })
        });

        setIsIncompleteInput(false);
        if (moduleName.value == "" || numberOfDays.value == 0 || days.some(d => d.description == "") || events.some(e => e.name == "") || events.some(e => e.startTime == "") || events.some(e => e.endTime == "")) {
            setIsIncompleteInput(true);
        }
        else {
            const newModule: ModuleType = {
                id: module.id ?? 0,
                name: moduleName.value,
                numberOfDays: numberOfDays.value,
                days: days
            };

            saveAppliedModule(index, newModule);
            collapseToggle.checked = false;
        }
    }

    return (
        <form id="editCourse-form" onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col justify-between">
                <div className="flex flex-row items-center">
                    <h2 className="self-start mt-2 w-1/4 text-lg mb-2">Module Name: </h2>
                    <div className="w-3/4">
                        <InputSmall type="text" name="moduleName" onChange={(e) => setModuleName(e.target.value)} placeholder="Module name" value={moduleName} />
                    </div>
                </div>
                <div className="flex flex-row items-center">
                    <h2 className="self-start mt-2 w-1/4 text-lg mb-2">Number of days:</h2>
                    <input type="number" name="numberOfDays" onChange={(e) => setNumOfDays(parseInt(e.target.value))} value={numOfDays} className="input input-bordered input-sm w-3/5 mr-4" placeholder="Number of days" />
                    <PrimaryBtn onClick={handleDays}>Apply</PrimaryBtn>
                </div>
            </div>
            <div className="flex flex-col space-y-2">
                {days.map((day) =>
                    <AppliedDay key={"day_" + day.dayNumber} moduleIndex={index} setDays={setDays} days={days} day={day} setNumOfDays={setNumOfDays} />)}
            </div>
            {isIncompleteInput &&
                <p className="error-message text-red-600 text-sm" id="invalid-helper">Please fill in all the fields</p>}
            
            <div className="mb-4"></div>
        </form>
    )
}
