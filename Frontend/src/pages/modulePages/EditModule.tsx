import { useQuery } from "react-query";
import { editModule, getModuleById } from "../../api/ModuleApi";
import Page from "../../components/Page";
import Module from "../../components/module/Module";
import { getIdFromPath } from "../../helpers/helperMethods";
import LoadingMessage from "../../components/LoadingMessage";
import ErrorMessage from "../../components/ErrorMessage";

export default function () {

    const moduleId = getIdFromPath();

    const { data: module, isLoading, isError } = useQuery({
        queryKey: ['modules', moduleId],
        queryFn: () => getModuleById(parseInt(moduleId))
    });

    return (
        <Page>
            {isLoading && <LoadingMessage />}
            {isError && <ErrorMessage />}
            {module && <Module module={module} submitFunction={editModule} buttonText="Save changes"/>}
        </Page>
    )
}