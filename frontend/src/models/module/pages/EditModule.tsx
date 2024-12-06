import Page from "@components/Page";
import { useIdFromPath } from "@helpers/helperHooks";
import LoadingMessage from "@components/LoadingMessage";
import ErrorMessage from "@components/ErrorMessage";
import Module from "../sections/Module";
import { useQueryModuleById } from "@api/module/moduleQueries";

export default function EditModule() {
    const moduleId = useIdFromPath();
    const { data, isLoading, isError } = useQueryModuleById(moduleId);

    return (
        <Page>
            {isLoading && <LoadingMessage />}
            {isError && <ErrorMessage />}
            {data && <Module module={data} buttonText="Save changes" />}
        </Page>
    )
}