import { postModule } from "@api/ModuleApi"
import Page from "@components/Page"
import Module from "../sections/Module"
import { ModuleType } from "../Types"

export default function CreateModule() {
    const emptyModule: ModuleType =
    {
        name: "",
        numberOfDays: 1,
        days: [{
            dayNumber: 1,
            description: "",
            events: []
        }],
        track: []
    }

    return (
        <Page>
            <Module module={emptyModule} submitFunction={postModule} buttonText="Create" />
        </Page>
    )
}