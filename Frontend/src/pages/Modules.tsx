import { useQuery } from "react-query";
import { getAllModules } from "../api/ModuleApi";
import { Link } from "react-router-dom";

export default function Modules() {

    const { data, isLoading, isError } = useQuery({
        queryKey: ['modules'],
        queryFn: getAllModules
    });
    console.log(data);

    return (
        <>
            {isLoading && <p>Loading...</p>}
            {isError && <p>An error occured...</p>}
            {data && data.map((module, index) =>
                <Link to={`/home/module/${module.id}`} key={module.name + index} className="border border-black pb-[100%] relative">
                    <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                        {module.name}
                    </div>
                </Link>
            )}
        </>
    )
}