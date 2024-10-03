import { postModule } from "../../../api/ModuleApi"
import Page from "../../../components/Page"
import { getCookie } from "../../../helpers/cookieHelpers"
import { trackUrl } from "../../../helpers/helperMethods"
import Login from "../../login/Login"
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
        getCookie("access_token") == undefined
            ? <Login />
            : <Page>
                <Module module={emptyModule} submitFunction={postModule} buttonText="Create" />
            </Page>
    )
}