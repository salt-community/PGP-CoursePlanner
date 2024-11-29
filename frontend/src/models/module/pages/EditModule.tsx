import { useQuery } from "@tanstack/react-query";
import { editModule, getModuleById } from "@api/ModuleApi";
import Page from "@components/Page";
import { useIdFromPath } from "@helpers/helperHooks";
import LoadingMessage from "@components/LoadingMessage";
import ErrorMessage from "@components/ErrorMessage";
import Module from "../sections/Module";

export default function EditModule() {
    const moduleId = useIdFromPath();

    const { data: module, isLoading, isError } = useQuery({
        queryKey: ['modules', moduleId],
        queryFn: () => getModuleById(parseInt(moduleId))
    });

    return (
        <Page>
            {isLoading && <LoadingMessage />}
            {isError && <ErrorMessage />}
            {module && <Module module={module} submitFunction={editModule} buttonText="Save changes" />}
        </Page>
    )
}