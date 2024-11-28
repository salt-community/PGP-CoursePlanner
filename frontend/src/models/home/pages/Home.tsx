import { getCookie, setCookie } from "@helpers/cookieHelpers";
import Page from "@components/Page";
import Login from "./Login";
import WeeksContainer from "../sections/WeeksContainer";
import { setTokenCookies } from "../helpers/useGetTokens";
import { getTokens, tokenResponse } from "@api/UserApi";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
    if (location.search) {
        const authCode = new URLSearchParams(location.search).get('code');
        if (authCode !== null) {
            setCookie("auth_code", authCode);
        }
    }
    
    const { data } = useQuery<tokenResponse>({
        queryKey: ['accessCode'],
        queryFn: getTokens,
    })
    setTokenCookies(data);
    return (
        <>
            {!getCookie("auth_code") && (!getCookie("JWT") || !getCookie("access_token"))
                ?
                <Login />
                :
                <Page>
                    <WeeksContainer />
                </Page>
            }
        </>
    )
}