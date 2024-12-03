import Login from "@models/login/Login";
import NavBar from "./NavBar";
import { getCookie, setCookie, setTokenCookies } from "@helpers/cookieHelpers";
import { useQuery } from "@tanstack/react-query";
import { getTokens, tokenResponse } from "@api/userFetches";

type Props = {
    children: React.ReactNode;
}

export default function Page({ children }: Props) {
    // This if statement is a production fix for getting the auth code from the URL. 
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
                <section className="w-screen h-screen">
                    <NavBar />
                    {children}
                </section>
            }
        </>
    )
}