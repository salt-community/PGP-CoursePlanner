import InputSmall from "../../../components/inputFields/InputSmall";
import PrimaryBtn from "../../../components/buttons/PrimaryBtn";
import SuccessBtn from "../../../components/buttons/SuccessBtn";
import { useState, FormEvent } from "react";
import { AppliedModuleProps, AppliedDayType, AppliedModuleType, AppliedEventType } from '../Types';
import AppliedDay from "./AppliedDay";

export default function AppliedModule({ submitFunction, module, index, buttonText }: AppliedModuleProps) {
    const [moduleName, setModuleName] = useState<string>(module.name);
    const [numOfDays, setNumOfDays] = useState<number>(module.days.length);
    const [days, setDays] = useState<AppliedDayType[]>(module.days);
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
        const events: AppliedEventType[] = [];
        days.forEach(day => {
            var eventsOfDay = day.events;
            eventsOfDay.forEach(event => {
                events.push(event);
            })
        });

        setIsIncompleteInput(false);
        if (moduleName.value == "" || numberOfDays.value == 0 || days.some(d => d.description == "") || events.some(e => e.name == "") || events.some(e => e.startTime == "") || events.some(e => e.endTime == "")) {
            setIsIncompleteInput(true);
        }
        else {
            const newModule: AppliedModuleType = {
                id: module.id ?? 0,
                name: moduleName.value,
                numberOfDays: numberOfDays.value,
                days: days
            };

            submitFunction(index, newModule);
            collapseToggle.checked = false;
        }
    }

    return (
        <form id="editCourse-form" onSubmit={handleSubmit} className="flex flex-col gap-4 w-min">
            <div className="w-auto flex flex-col justify-between">
                <div className="flex flex-row w-[800px] gap-4 items-center">
                    <div className="self-start mt-2">
                        <h2 className="text-lg mb-2 w-[150px]">Module Name: </h2>
                    </div>
                    <InputSmall type="text" name="moduleName" onChange={(e) => setModuleName(e.target.value)} placeholder="Module name" value={moduleName} />
                </div>
                <div className="flex flex-row gap-4 items-center">
                    <div className="self-start mt-2">
                        <h2 className="text-lg mb-2 w-[150px]">Number of days: </h2>
                    </div>
                    <input type="number" name="numberOfDays" onChange={(e) => setNumOfDays(parseInt(e.target.value))} value={numOfDays} className="input input-bordered input-sm max-w-xs" placeholder="Number of days" />
                <PrimaryBtn onClick={handleDays}>Apply</PrimaryBtn>
                </div>
            </div>
            <div className="flex flex-col space-y-2">
                {days.map((day) =>
                    <AppliedDay key={"day_" + day.dayNumber} moduleIndex={index} setDays={setDays} days={days} day={day} setNumOfDays={setNumOfDays} />)}
            </div>
            {isIncompleteInput &&
                <p className="error-message text-red-600 text-sm" id="invalid-helper">Please fill in all the fields</p>}
            <SuccessBtn value={buttonText}></SuccessBtn>
            <div className="mb-4"></div>
        </form>

    )
}
