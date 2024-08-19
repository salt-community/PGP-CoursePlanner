import { useQuery } from "@tanstack/react-query";
import LoadingMessage from "../../components/LoadingMessage";
import { setCookie } from "../../helpers/cookieHelpers";
import { refreshTokens } from "../../api/UserApi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getHomeUrl } from "../../helpers/helperMethods";

const redirectLink = getHomeUrl();
const LOGIN_URL = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/calendar.events.owned&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&redirect_uri=${redirectLink}&client_id=735865474111-hbubksmrfl5l6b7tkgnjetiuqp1jvoeh.apps.googleusercontent.com&access_type=offline&prompt=consent`;


export default function Login() {
    const navigate = useNavigate();

    const login = () => {
        location.href = LOGIN_URL;
    }

    const { data: response, isLoading, isError } = useQuery({
        queryKey: ["accessCode"],
        queryFn: () => refreshTokens(),
    });


    console.log("response from refresh tokens: ", response)
    if (response !== undefined && response !== null && !isError) {
        const { access_token, id_token, expires_in } = response;

        console.log("response from refresh tokens was not undefined, setting access_token to: ");
        console.log(access_token);
        console.log("and JWT to: ");
        console.log(id_token);
        setCookie("access_token", access_token, expires_in);
        setCookie("JWT", id_token, expires_in);
        window.location.reload();
    }
    useEffect(() => {
        if (isError) {
            navigate("/login");
        }
    }, [])



    return (
        isLoading || response ?
            <LoadingMessage />
            :
            <section className="px-5 text-center w-full h-screen flex justify-center items-center flex-col gap-4">
                <p>CHANGES APPLIED TO DEPLOYED SITE!!</p>
                <img src={"https://salt.dev/wp-content/uploads/2024/02/salt-logo-dark.svg"} alt="logo" className="w-[40%] h-auto mb-10" />
                <button type="button" onClick={() => login()} className="text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2 mb-2 max-w-sm">
                    <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                    Sign up with Google
                    <div>
                    </div>
                </button>
            </section>
    )
}
