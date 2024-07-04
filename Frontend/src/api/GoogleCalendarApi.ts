import { GoogleEvent } from "../helpers/googleHelpers";

interface EventData {
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
  location: string;
  id: string;
}

interface EventDataArr {
  items: EventData[];
}

const BASE_URL =
  "https://www.googleapis.com/calendar/v3/calendars/primary/events";

export async function createCalendarTemplate(eventTemplate: GoogleEvent[]) {
  eventTemplate.map(async (event) => {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
      body: JSON.stringify(event),
    });
    const data = await response.json();
    return data;
  });

  try {
  } catch (error) {
    console.error("Error creating events", error);
    alert("Failed to create events");
  }
}
