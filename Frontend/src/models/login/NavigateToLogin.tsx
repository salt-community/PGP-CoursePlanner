import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import LoadingMessage from "../../components/LoadingMessage"
import { useQuery } from "react-query";
import { refreshTokensFromBackend } from "../../api/UserApi";
import { setCookie } from "../../helpers/cookieHelpers";

type props = {
    path: string
}
export default function NavigateToLogin({ path }: props) {

    const { data: response, isError } = useQuery({
        queryKey: ["accessCode"],
        queryFn: () => refreshTokensFromBackend(),
    });

    if (isError) {
        return;
    }
    else if (response) {
        console.log("response from refresh tokens: ", response);
        const { access_token, id_token, expires_in } = response;

        if (access_token != undefined && id_token != undefined) {
            setCookie("access_token", access_token, expires_in);
            setCookie("JWT", id_token, expires_in);

            window.location.href = path;
        }
    }

    useEffect(() => {
        navigate("/login")
    }, [window.location.href])
    const navigate = useNavigate()

    return <LoadingMessage />
}