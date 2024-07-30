import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import LoadingMessage from "../../components/LoadingMessage"
import { setNewTokenCookies } from "../../helpers/helperMethods";


export default function NavigateToLogin() {
    setNewTokenCookies();

    return <LoadingMessage />
}