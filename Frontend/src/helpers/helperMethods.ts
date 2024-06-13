import { useLocation } from "react-router-dom";

export function getIdFromPath () {
    const { pathname } = useLocation();
    const pathArray = pathname.split("/");
    return pathArray[pathArray.length - 1];
}