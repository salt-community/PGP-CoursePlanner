import { getAllModules } from "../../../api/ModuleApi";
import Page from "../../../components/Page";
import { Link } from "react-router-dom";
import LoadingMessage from "../../../components/LoadingMessage";
import ErrorMessage from "../../../components/ErrorMessage";
import { getCookie } from "../../../helpers/cookieHelpers";
import Login from "../../login/Login";
import { useQuery } from "@tanstack/react-query";

export default function Modules() {

    const { data, isLoading, isError } = useQuery({
        queryKey: ['modules'],
        queryFn: getAllModules
    });

    return (
        getCookie("access_token") == undefined ?
            <Login />
            :
            <Page>
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-24 lg:px-56">
                    {isLoading && <LoadingMessage />}
                    {isError && <ErrorMessage />}
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