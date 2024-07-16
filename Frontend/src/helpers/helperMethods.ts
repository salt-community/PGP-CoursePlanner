import { useLocation } from "react-router-dom";

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
