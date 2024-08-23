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
  const pathName = location.href;
  let len = pathName.length,
    i = -1,
    index = 3;
  while (index-- && i++ < len) {
    i = pathName.indexOf("/", i);
    if (i < 0) break;
  }
  return pathName.substring(0, i);
}

export function getDateFromPath() {
  const { pathname } = useLocation();
  const pathArray = pathname.split("=");
  return pathArray[pathArray.length - 1];
}

export function getWeekFromPath() {
  const { pathname } = useLocation();
  const pathArray = pathname.split("=");
  const pathArraySplit = pathArray[pathArray.length - 1].split("-");
  return pathArraySplit[0];
}

export function getMonthFromPath() {
  const { pathname } = useLocation();
  const pathArray = pathname.split("=");
  const pathArraySplit = pathArray[pathArray.length - 1].split("-");
  return pathArraySplit[0];
}

export function getYearFromPath() {
  const { pathname } = useLocation();
  const pathArray = pathname.split("=");
  const pathArraySplit = pathArray[pathArray.length - 1].split("-");
  return pathArraySplit[1];
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

export function trackUrl() {
  const url = window.location.href;
  const history = JSON.parse(localStorage.getItem('urlHistory') || '[]');
  
  // Only store the current URL if it's different from the last one
  if (history[history.length - 1] !== url) {
      history.push(url);
      localStorage.setItem('urlHistory', JSON.stringify(history));
  }
}
