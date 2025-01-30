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
            events: [],
            date: new Date().toISOString(),
        }],
        tracks: []
    }

    return (
        <Page>
            <Module module={emptyModule} buttonText="Create" />
        </Page>
    )
}