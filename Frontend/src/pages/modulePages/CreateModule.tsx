import { postModule } from "../../api/ModuleApi"
import Page from "../../sections/Page"
import Module from "../../sections/module/Module"
import { ModuleType } from "../../sections/module/Types"

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