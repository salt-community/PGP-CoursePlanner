import { getCookie } from "@helpers/cookieHelpers";
import { EventType } from "@models/module/Types";

const BASE_URL = `${process.env.VITE_BACKEND_URL} from "./backendUrl";
}/AppliedEvents`;

export async function postAppliedEvent(event: EventType): Promise<EventType> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${getCookie("JWT")}`,
      Accept: "application/json",
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}