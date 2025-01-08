import Page from "@components/Page";
import WeeksContainer from "../sections/WeeksContainer";
import { trackUrl } from "@helpers/helperMethods";

export default function Home() {
    trackUrl();

    return (
        <Page>
            <WeeksContainer />
        </Page>
    )
}