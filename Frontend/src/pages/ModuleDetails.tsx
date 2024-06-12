import { Link, useLocation } from "react-router-dom";
import { getModuleById } from "../api/ModuleApi";
import Page from "../components/Page";
import { useQuery } from "react-query";

export default function ModuleDetails() {
    const { pathname } = useLocation();
    const pathArray = pathname.split("/");
    const moduleId = pathArray[pathArray.length - 1];

    const { data: module, isLoading, isError } = useQuery({
        queryKey: ['modules', moduleId],
        queryFn: () => getModuleById(parseInt(moduleId))
    });

    return (
        <Page>
            {isLoading && <p>Loading...</p>}
            {isError && <p>An error occured</p>}
            {module && module.name}
        </Page>
    )
}