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

    if (response && response.ok) {
      const data = await response.json();
      return data as tokenResponseFromBackend;
    }
    return null;
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
