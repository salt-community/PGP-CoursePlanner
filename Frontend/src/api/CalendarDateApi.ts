import { getCookie } from "../helpers/cookieHelpers";
import { CalendarDateType } from "../models/calendar/Types";
import { BACKEND_URL } from "./BackendUrl";

const BASE_URL = `${BACKEND_URL}/CalendarDates`;

export async function getCalendarDate(date: string) {
  const response = await fetch(`${BASE_URL}/${date}`, {
    headers: {
      Authorization: `Bearer ${getCookie("JWT")}`,
      Accept: "application/json",
    },
  });
  if (response.ok) {
    const data = await response.json();
    return data as CalendarDateType;
  }
}
