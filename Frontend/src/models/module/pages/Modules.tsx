import { useQuery } from "react-query";
import { getAllModules } from "../../../api/ModuleApi";
import Page from "../../../components/Page";
import { Link } from "react-router-dom";

export default function Modules() {

    const { data, isLoading, isError } = useQuery({
        queryKey: ['modules'],
        queryFn: getAllModules
    });

    return (
        <Page>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-24 lg:px-56">
                {isLoading && <p>Loading...</p>}
                {isError && <p>An error occured...</p>}
                {data &&
                    <Link to={"/modules/create"} className="border border-black bg-primary text-white pb-[100%] relative">
                        <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                            Create new module
                        </div>
                    </Link>}
                {data && data.map((module, index) =>
                    <Link to={`/modules/details/${module.id}`} key={module.name + index} className="border border-black pb-[100%] relative">
                        <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                            {module.name}
                        </div>
                    </Link>
                )}
            </section>
        </Page>
    )
}