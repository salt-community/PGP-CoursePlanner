import { SyntheticEvent } from "react";
import { ModuleType } from "@models/module/Types";

type Props = {
    modules: ModuleType[],
    options: string[],
    funcFilter: (event: FormData) => void,
    funcResetFilter: () => void
}

export default function FilterArea({ options, funcFilter }: Props) {

    const handleChange = (event: SyntheticEvent) => {
        event.preventDefault();
        const form = (event.target as HTMLSelectElement).closest('form');
        if (form) {
            const formData = new FormData(form);
            funcFilter(formData);
        }
    }

    return (
        <>
            <div className='filter-area flex flex-row items-center'>
                <form className="flex flex-row items-center w-full" id="form_filter">
                    <label className="self-start mt-2 w-1/4 text-lg mb-2 filter-label">Track: </label>
                    <div className="w-3/4">
                        <select className="border border-gray-300 rounded-lg p-1 w-full input-field" name="track" onChange={handleChange} defaultValue="Please select module track" >
                        <option value={"All"}>All</option>
                        {options.map((option, index) => {
                                return (
                                    <option key={index}value={option}>{option}</option>
                                )
                            })}
                        </select>
                    </div>

                    {/* <input className="w-1/4 input-button" type="submit" name="submitFilter" value="Filter modules" /> */}
                </form>
            </div>
        </>
    )
}