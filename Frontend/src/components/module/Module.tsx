import { FormEvent, useState } from "react";
import Day from "../day/Day";
import { DayType } from "../day/Types";
import { ModuleProps, ModuleType } from "./Types";
import PrimaryBtn from "../buttons/PrimaryBtn";
import SuccessBtn from "../buttons/SuccessBtn";
import InputSmall from "../inputFields/InputSmall";
import { useMutation, useQueryClient } from "react-query";

export default function Module({ submitFunction, module }: ModuleProps) {
    const [days, setDays] = useState<number>(0);
    const [daysOfModule, setDaysOfModule] = useState<DayType[]>(module.days);

    const handleDays = () => {
        const numOfDays = ([...Array(days).keys()].map(i => i + 1));

        const editedDays: DayType[] = [];
        numOfDays.map((num) => {
            const newDay = {
                dayNumber: num,
                description: "",
                events: []
            };

            editedDays.push(newDay)
        })
        setDaysOfModule(editedDays);
    }

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (module: ModuleType) => {
            return submitFunction(module);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules'] })
        }
    })

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { moduleName } = e.target as typeof e.target & { moduleName: { value: string } };
        const { numberOfDays } = e.target as typeof e.target & { numberOfDays: { value: number } };

        const module: ModuleType = {
            name: moduleName.value,
            numberOfDays: numberOfDays.value,
            days: daysOfModule
        };

        mutation.mutate(module);
    }

    return (
        <section className="px-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
                <div className="w-[320px] overflow-scroll sm:w-auto sm:overflow-auto flex space-x-8">
                    <InputSmall type="text" name="moduleName" placeholder="Module name" />
                    <input type="number" name="numberOfDays" onChange={(e) => setDays(parseInt(e.target.value))} className="input input-bordered input-sm max-w-xs" placeholder="Number of days" />
                    <PrimaryBtn onClick={handleDays}>Apply</PrimaryBtn>
                </div>
                <div className="w-[320px] overflow-scroll sm:w-auto sm:overflow-auto">
                    {daysOfModule.map((day) => <Day key={"day_" + day.dayNumber} setDays={setDaysOfModule} days={daysOfModule} dayNumber={day.dayNumber} events={day.events} />)}
                </div>
                <SuccessBtn value="Create Module" />
            </form>
        </section>
    )
}