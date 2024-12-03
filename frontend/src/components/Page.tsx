import Login from "@models/login/Login";
import NavBar from "./NavBar";
import { getCookie, setCookie } from "@helpers/cookieHelpers";
import { useQueryToken } from "@api/userQueries";

type Props = {
    children: React.ReactNode;
}

export default function Page({ children }: Props) {
    useQueryToken();
    // This if statement is a production fix for getting the auth code from the URL. 
    if (location.search) {
        const authCode = new URLSearchParams(location.search).get('code');
        if (authCode !== null) {
            setCookie("auth_code", authCode);
        }
    }

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