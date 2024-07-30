import { useLocation, useNavigate } from "react-router-dom";
import { refreshTokensFromBackend } from "../api/UserApi";
import { getCookie, setCookie } from "./cookieHelpers";
import { useQuery } from "react-query";

export function getIdFromPath() {
  const { pathname } = useLocation();
  const pathArray = pathname.split("/");
  return pathArray[pathArray.length - 1];
}

export function getDateFromPath() {
  const { pathname } = useLocation();
  const pathArray = pathname.split("=");
  return pathArray[pathArray.length - 1];
}

export function getWeekFromPath() {
  const { pathname } = useLocation();
  const pathArray = pathname.split("=");
  return pathArray[pathArray.length - 1];
}

export function setNewTokenCookies() {
  const navigate = useNavigate();

  const { data: response, isError } = useQuery({
    queryKey: ["accessCode"],
    queryFn: () => refreshTokensFromBackend(),
  });

  if (isError) {
    return;
  }
  if (response) {
    console.log("response from refresh tokens: ", response);
    const { access_token, id_token, expires_in } = response;

    if (access_token == undefined || id_token == undefined) {
      return;
    }

    setCookie("access_token", access_token, expires_in);
    setCookie("JWT", id_token, expires_in);

    navigate(getCookie("go_to")!);
  }
}
