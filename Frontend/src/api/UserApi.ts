import { BACKEND_URL } from "./BackendUrl";

const BASE_URL = `${BACKEND_URL}/Tokens`;

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

export async function getTokens(auth_code: string) {
  try {
    const code = encodeURIComponent(auth_code);
    const response = await fetch(`${BASE_URL}/${code}`, {
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

export async function refreshTokens() {
  try {
    const response = await fetch(BASE_URL);

    if (response && response.ok) {
      const data = await response.json();
      return data as tokenResponseFromBackend;
    }
    return null;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteRefreshToken() {
  try {
    await fetch(BASE_URL, {
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
