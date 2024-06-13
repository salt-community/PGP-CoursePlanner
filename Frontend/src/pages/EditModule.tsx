import { getModuleById } from "../api/ModuleApi";
import { getIdFromPath } from "../helpers/helperMethods";

export default function () {

    const moduleId = getIdFromPath();
    
    const { data: module, isLoading, isError } = useQuery({
        queryKey: ['modules', moduleId],
        queryFn: () => getModuleById(parseInt(moduleId))
    });
    
    return (
        <>
        </>
    )
}