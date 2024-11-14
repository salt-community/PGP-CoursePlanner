import { getCookie } from "@helpers/cookieHelpers";
import { AppliedEventType } from "@models/appliedCourse/Types";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL} from "./backendUrl";
}/AppliedEvents`;

export async function postAppliedEvent(event: AppliedEventType) {
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
    alert("Failed to apply event");
    throw new Error("Failed to apply event");
  }
  const data = await response.json();
  return data as AppliedEventType;
}