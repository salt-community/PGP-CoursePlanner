import { useState } from "react";
import Day from "../day/Day";

export default function Module() {
    const [days, setDays] = useState<number>(0);
    const [numOfDays, setNumOfDays] = useState<number[]>([1]);

    const handleDays = () => {
        setNumOfDays([...Array(days).keys()].map(i => i + 1));
        console.log(numOfDays);
    }

    return (
        <section className="px-4">
            <form className="flex flex-col gap-4 ">
                <div className="w-[320px] overflow-scroll sm:w-auto sm:overflow-auto flex space-x-8">
                    <input type="text" name="moduleName" className="input input-bordered w-full input-sm max-w-xs" placeholder="Module name" />
                    <input type="number" name="numberOfDays" onChange={(e) => setDays(parseInt(e.target.value))} className="input input-bordered input-sm max-w-xs" placeholder="Number of days"/>
                    <button type="button" onClick={handleDays} className="btn btn-sm max-w-48 btn-primary">Apply</button>
                </div>
                <div className="w-[320px] overflow-scroll sm:w-auto sm:overflow-auto">
                    {numOfDays.map((num) => <Day key={"day_" + num}/>)}
                </div>
                <input type="submit" className="btn btn-sm mt-4 max-w-48 btn-success text-white" value="Create Template" />
            </form>
        </section>
    )
}