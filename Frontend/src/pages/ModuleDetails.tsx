import { useLocation } from "react-router-dom";
import { getModuleById } from "../api/ModuleApi";

export default function ModuleDetails () {
    const {pathname} = useLocation();
    const pathArray = pathname.split("/");
    const moduleId = pathArray[pathArray.length -1];

    const {data: module, isLoading, isError} = useQuery({
        queryKey: ['modules', moduleId],
        queryFn: () => getModuleById(parseInt(moduleId))
    });

    return (
        <></>
    )
}