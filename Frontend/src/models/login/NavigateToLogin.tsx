import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import LoadingMessage from "../../components/LoadingMessage"

export default function NavigateToLogin() {
    useEffect(() => {
        navigate("/login")
    }, [window.location.href])
    const navigate = useNavigate()

    return <LoadingMessage />
}