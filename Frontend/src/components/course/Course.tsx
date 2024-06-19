import { useQuery } from "react-query";
import { getAllModules } from "../../api/ModuleApi";
import SuccessBtn from "../buttons/SuccessBtn";
import InputSmall from "../inputFields/InputSmall";
import DropDown from "../DropDown";

export default function Course() {

    const { data: modules } = useQuery({
        queryKey: ['modules'],
        queryFn: getAllModules
    });

    const moduleNames: string[] = [];

    if (modules) {
        modules.forEach(module => moduleNames.push(module.name));
    }

    return (
        <section className="px-4">
            <form className="flex flex-col gap-4 ">
                <div className="w-[320px] overflow-scroll sm:w-auto sm:overflow-auto flex space-x-8">
                    <InputSmall type="text" name="moduleName" placeholder="Course name" />
                    <InputSmall type="number" name="numberOfDays" placeholder="Number of weeks" />
                    <button type="button" className="btn btn-sm max-w-48 btn-primary">Apply</button>
                </div>

                <DropDown modules={moduleNames} />

                <SuccessBtn value="Create Course" />
            </form>
        </section>
    )
}