import { getCookie } from "../helpers/cookieHelpers";

const BASE_URL = "https://accounts.google.com/o/oauth2/token";

export type tokenResponse = {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
};

export async function getTokens(auth_code: string) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: auth_code,
      client_id: import.meta.env.VITE_APP_CLIENT_ID,
      client_secret: import.meta.env.VITE_APP_CLIENT_SECRET,
      redirect_uri: import.meta.env.VITE_APP_NEXTAUTH_URL,
    }),
  });
  const data = (await response.json());
  return data as tokenResponse;
}

try {
} catch (error) {
  console.error("Error getting access token", error);
  alert("Failed to get access token");
}

export async function refreshTokens() {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: import.meta.env.VITE_APP_CLIENT_ID,
      client_secret: import.meta.env.VITE_APP_CLIENT_SECRET,
      refresh_token: getCookie("refresh_token")!,
    }),
  });
  const data = (await response.json());
  return data as tokenResponse;
}

try {
} catch (error) {
  console.error("Error refreshing token", error);
  alert("Failed refresh token");
}
