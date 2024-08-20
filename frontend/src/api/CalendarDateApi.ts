import { getCookie } from "../helpers/cookieHelpers";

const BASE_URL = `${import.meta.env.VITE_backend_URL}/CalendarDates`;

export async function getCalendarDate(date: string) {
  try {
    const response = await fetch(`${BASE_URL}/${date}`, {
      headers: {
        Authorization: `Bearer ${getCookie("JWT")}`,
        Accept: "application/json",
      },
    });

    if (!response.ok || response == null) {
      // alert("Failed to get applied courses");
      return;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // console.error(error);
    // alert("Failed to get applied courses");
  }
}
