import { FormEvent, useState } from "react";
import Day from "../day/Day";
import { DayType } from "../day/Types";
import { ModuleProps, ModuleType } from "./Types";
import PrimaryBtn from "../buttons/PrimaryBtn";
import SuccessBtn from "../buttons/SuccessBtn";
import InputSmall from "../inputFields/InputSmall";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

export default function Module({ submitFunction, module, buttonText }: ModuleProps) {
    const navigate = useNavigate();
    const [moduleName, setModuleName] = useState<string>(module.name);
    const [numOfDays, setNumOfDays] = useState<number>(module.days.length);
    const [days, setDays] = useState<DayType[]>(module.days);

    const handleDays = () => {
        const numOfDaysArray = ([...Array(numOfDays - days.length).keys()].map(i => i + 1));

        const editedDays = days.slice();
        numOfDaysArray.map((num) => {
            const newDay = {
                dayNumber: num,
                description: "",
                events: []
            };

            editedDays.push(newDay)
        })
        setDays(editedDays);
    }

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (module: ModuleType) => {
            return submitFunction(module);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules'] })
            navigate(`/modules`)
        }
    })

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { moduleName } = e.target as typeof e.target & { moduleName: { value: string } };
        const { numberOfDays } = e.target as typeof e.target & { numberOfDays: { value: number } };

        const newModule: ModuleType = {
            id: module.id ?? 0,
            name: moduleName.value,
            numberOfDays: numberOfDays.value,
            days: days
        };

        mutation.mutate(newModule);
    }

    return (
        <section className="px-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
                <div className="w-[320px] overflow-scroll sm:w-auto sm:overflow-auto flex space-x-8">
                    <InputSmall type="text" name="moduleName" onChange={(e) => setModuleName(e.target.value)} placeholder="Module name" value={moduleName} />
                    <input type="number" name="numberOfDays" onChange={(e) => setNumOfDays(parseInt(e.target.value))} value={numOfDays} className="input input-bordered input-sm max-w-xs" placeholder="Number of days" />
                    <PrimaryBtn onClick={handleDays}>Apply</PrimaryBtn>
                </div>
                <div className="w-[320px] overflow-scroll sm:w-auto sm:overflow-auto">
                    {days.map((day) => <Day key={"day_" + day.dayNumber} setDays={setDays} days={days} day={day} />)}
                </div>
                <SuccessBtn value={buttonText} />
            </form>
        </section>
    )
}