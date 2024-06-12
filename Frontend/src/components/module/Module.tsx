import { FormEvent, useState } from "react";
import Day from "../day/Day";
import { getAllModules, postModule } from "../../api/ModuleApi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { DayType } from "../day/Types";
import { ModuleType } from "./Types";
import PrimaryBtn from "../buttons/PrimaryBtn";

export default function Module() {
    const [days, setDays] = useState<number>(0);
    const [daysOfModule, setDaysOfModule] = useState<DayType[]>([{
        dayNumber: 1,
        description: "",
        events: []
    }]);

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

    const { data } = useQuery({
        queryKey: ['modules'],
        queryFn: getAllModules
    });
    console.log(data);


    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (module: ModuleType) => {
            return postModule(module);
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
                    <input type="text" name="moduleName" className="input input-bordered w-full input-sm max-w-xs" placeholder="Module name" />
                    <input type="number" name="numberOfDays" onChange={(e) => setDays(parseInt(e.target.value))} className="input input-bordered input-sm max-w-xs" placeholder="Number of days" />
                    <PrimaryBtn onClick={handleDays}>Apply</PrimaryBtn>
                </div>
                <div className="w-[320px] overflow-scroll sm:w-auto sm:overflow-auto">
                    {daysOfModule.map((day) => <Day key={"day_" + day.dayNumber} setDays={setDaysOfModule} days={daysOfModule} dayNumber={day.dayNumber} events={day.events} />)}
                </div>
                <input type="submit" className="btn btn-sm mt-4 max-w-48 btn-success text-white" value="Create Module" />
            </form>
        </section>
    )
}