import { useQuery } from "react-query";
import { getAllModules } from "../../api/ModuleApi";
import Page from "../../components/Page";
import { Link } from "react-router-dom";


export default function Modules() {

    const { data, isLoading, isError } = useQuery({
        queryKey: ['modules'],
        queryFn: getAllModules
    });

    return (
        <Page>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
                {isLoading && <p>Loading...</p>}
                {isError && <p>An error occured...</p>}
                {data && data.map((module, index) =>
                    <Link to={`/modules/details/${module.id}`} key={module.name + index} className="border border-black pb-[100%] relative">
                        <div className="flex items-center justify-center flex-col w-80">
                            {module.name}
                        </div>
                    </Link>
                )}
            </section>
        </Page>
    )
}