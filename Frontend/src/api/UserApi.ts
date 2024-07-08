import { setCookie } from "../helpers/cookieHelpers";

const BASE_URL = "https://accounts.google.com/o/oauth2/token";

export type tokenResponse = {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
}

export async function getAccessToken(auth_code: string) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
        "grant_type": "authorization_code",
        "code": auth_code,
        "client_id": import.meta.env.VITE_APP_CLIENT_ID,
        "client_secret": import.meta.env.VITE_APP_CLIENT_SECRET,
        "redirect_uri": "http://localhost:5173"
    }),
  });
  const data = await response.json();
  console.log("response after post: ", data);
  return data as tokenResponse;
}

try {
} catch (error) {
  console.error("Error getting access token", error);
  alert("Failed to get access token");
}
