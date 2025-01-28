import { getCookie } from "@helpers/cookieHelpers";
import { fetchWithRefreshTokenInterceptor } from "@helpers/interceptorHelpers";
import { DayType } from "@models/module/Types";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/AppliedDays`;

export async function postAppliedDay(day: DayType): Promise<DayType> {
  const response = await fetchWithRefreshTokenInterceptor(BASE_URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${getCookie("id_token")}`,
      Accept: "application/json",
    },
    body: JSON.stringify(day),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}