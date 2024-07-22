import { useLocation } from "react-router-dom";
import { refreshTokens } from "../api/UserApi";
import { deleteCookie, setCookie } from "./cookieHelpers";
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
  console.log("refreshing tokens!!!");
  const {
    data: response
  } = useQuery({
    queryKey: ["accessCode"],
    queryFn: () => refreshTokens(),
  });


  if (response) {
    console.log("response from refresh tokens: ", response);
    const { access_token, id_token, expires_in } = response;

    setCookie("access_token", access_token, expires_in);
    setCookie("JWT", id_token, expires_in);

    history.back();
  }
}
