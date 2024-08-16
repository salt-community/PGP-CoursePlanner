import { useLocation } from "react-router-dom";
import { refreshTokens } from "../api/UserApi";
import { setCookie } from "./cookieHelpers";
import { useQuery } from "@tanstack/react-query";

export function getIdFromPath() {
  const { pathname } = useLocation();
  const pathArray = pathname.split("/");
  return pathArray[pathArray.length - 1];
}

export function getHomeUrl() {
  const pathname = location.href;
  const index = pathname.lastIndexOf("/");
  return pathname.substring(0, index);
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
  const { data: response, isError } = useQuery({
    queryKey: ["accessCode"],
    queryFn: () => refreshTokens(),
  });

  if (isError) {
    return;
  }
  if (response) {
    const { access_token, id_token, expires_in } = response;

    if (access_token == undefined || id_token == undefined) {
      return;
    }

    setCookie("access_token", access_token, expires_in);
    setCookie("JWT", id_token, expires_in);

    history.back();
  }
}
