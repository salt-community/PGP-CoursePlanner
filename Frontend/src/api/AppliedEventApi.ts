import { getCookie } from "../helpers/cookieHelpers";
import { AppliedEventType } from "../models/appliedCourse/Types";
import { BACKEND_URL } from "./BackendUrl";

const BASE_URL = `${BACKEND_URL}/AppliedEvents`;

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
  var data = await response.json();
  return data as AppliedEventType;
}