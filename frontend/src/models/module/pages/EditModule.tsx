import Page from "@components/Page";
import { useIdFromPath } from "@helpers/helperHooks";
import Module from "../sections/Module";
import { useQueryModuleById } from "@api/module/moduleQueries";
import ErrorModal from "@components/ErrorModal";

export default function EditModule() {
    const moduleId = useIdFromPath();
    const { data, isError } = useQueryModuleById(moduleId);

    return (
        <Page>
            {data && <Module module={data} buttonText="Save changes" />}
            {isError && <ErrorModal error="Module" />}
        </Page>
    )
}