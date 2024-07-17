import { postModule } from "../../../api/ModuleApi"
import Page from "../../../components/Page"
import { getCookie } from "../../../helpers/cookieHelpers"
import NavigateToLogin from "../../login/NavigateToLogin"
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
        }]
    }

    return (
        !getCookie("access_token") ?
            <NavigateToLogin />
            :
            <Page>
                <Module module={emptyModule} submitFunction={postModule} buttonText="Create" />
            </Page>
    )
}