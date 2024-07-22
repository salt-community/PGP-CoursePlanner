import { getCookie } from "../helpers/cookieHelpers";
import { CalendarDateType } from "../models/calendar/Types";
import { BACKEND_URL } from "./BackendUrl";

const BASE_URL = `${BACKEND_URL}/CalendarDates`;

export async function getCalendarDate(date: string) {
  try {
    const response = await fetch(`${BASE_URL}/${date}`, {
      headers: {
        Authorization: `Bearer ${getCookie("JWT")}`,
        Accept: "application/json",
      },
    });
    
    if (!response.ok || response == null) {
      alert("Failed to get applied courses");
    }

    const data = await response.json();
    return data as CalendarDateType[];
  } catch (error) {
    console.error(error);
    alert("Failed to get applied courses");
  }
}
