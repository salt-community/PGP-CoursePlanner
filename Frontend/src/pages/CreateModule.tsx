import Page from "../components/Page";
import Module from "../components/module/Module";
import { postModule } from "../api/ModuleApi";
import { ModuleType } from "../components/module/Types";

export default function CreateModule() {

    const emptyModule: ModuleType = 
        {
            name: "",
            numberOfDays: 1,
            days: [{
                dayNumber: 1,
                description: "",
                events: []
            }]
        } 
    

    return (
        <Page>
            <Module module={emptyModule} submitFunction={postModule} buttonText="Create"/>
        </Page>
    )
}