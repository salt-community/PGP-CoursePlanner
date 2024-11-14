import { getCookie } from "@helpers/cookieHelpers";
import { DayType } from "@models/module/Types";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/AppliedDays`;

export async function postAppliedDay(day: DayType) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${getCookie("JWT")}`,
      Accept: "application/json",
    },
    body: JSON.stringify(day),
  });

  if (!response.ok) {
    alert("Failed to apply day");
    throw new Error("Failed to apply day");
  }
  const data = await response.json();
  return data as DayType;
}