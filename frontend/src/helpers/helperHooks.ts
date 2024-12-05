import { useLocation } from "react-router-dom";
import { refreshToken } from "../api/user/userFetches";
import { setCookie } from "./cookieHelpers";
import { useQuery } from "@tanstack/react-query";

export function useIdFromPath() {
  const { pathname } = useLocation();
  const pathArray = pathname.split("/");
  return parseInt(pathArray[pathArray.length - 1]);
}

export function useDateFromPath() {
  const { pathname } = useLocation();
  const pathArray = pathname.split("=");
  return pathArray[pathArray.length - 1];
}

export function useWeekFromPath() {
  const { pathname } = useLocation();
  const pathArray = pathname.split("=");
  const pathArraySplit = pathArray[pathArray.length - 1].split("-");
  return pathArraySplit[0];
}

export function useMonthFromPath() {
  const { pathname } = useLocation();
  const pathArray = pathname.split("=");
  const pathArraySplit = pathArray[pathArray.length - 1].split("-");
  return pathArraySplit[0];
}

export function useYearFromPath() {
  const { pathname } = useLocation();
  const pathArray = pathname.split("=");
  const pathArraySplit = pathArray[pathArray.length - 1].split("-");
  return pathArraySplit[1];
}

export function useNewTokenCookies() {
  const { data: response, isError } = useQuery({
    queryKey: ["accessCode"],
    queryFn: () => refreshToken(),
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