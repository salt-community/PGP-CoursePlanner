import { getCookie } from "../helpers/cookieHelpers";
import { CalendarDateType } from "../models/calendar/Types";

const BASE_URL = "http://localhost:8080/CalendarDates";

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
