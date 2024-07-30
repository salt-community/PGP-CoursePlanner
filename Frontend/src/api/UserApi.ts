import { getCookie } from "../helpers/cookieHelpers";
import { BACKEND_URL } from "./BackendUrl";

const BASE_URL = "https://accounts.google.com/o/oauth2/token";
// const BASE_URL = `${BACKEND_URL}/Tokens`;

export type tokenResponse = {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
};

export type tokenResponseFromBackend = {
  access_token: string;
  expires_in: number;
  id_token: string;
};

export async function getTokensFromBackend(auth_code: string) {
  try {
    const code = encodeURIComponent(auth_code);
    const response = await fetch(`${BACKEND_URL}/Tokens/${code}`, {
      headers: {
        Accept: "application/json",
      },
    });

    const responseAsJson = await response.json();
    return responseAsJson as tokenResponseFromBackend;
  } catch (error) {
    console.error(error);
  }
}

export async function refreshTokensFromBackend() {
  try {
    const response = await fetch(`${BACKEND_URL}/Tokens`);

    const data = await response.json();
    return data as tokenResponseFromBackend;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteRefreshTokenFromBackend() {
  try {
    await fetch(`${BACKEND_URL}/Tokens`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Accept: "application/json",
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getTokens(auth_code: string) {
  try {
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
        redirect_uri: "http://localhost:5173",
      }),
    });

    if (!response.ok || response == undefined) {
      // alert("failed get access token");
      return;
    }
    const data = await response.json();
    return data as tokenResponse;
  } catch (error) {
    console.error("Error getting access token", error);
    // alert("Failed to get access token");
  }
}

export async function refreshTokens() {
  try {
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
    if (!response.ok || response == undefined) {
      alert("failed to refresh tokens");
      return;
    }
    const data = await response.json();
    return data as tokenResponse;
  } catch (error) {
    console.error("Error refreshing token", error);
    alert("Failed refresh token");
  }
}
