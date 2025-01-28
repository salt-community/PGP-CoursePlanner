import { setCookie, setTokenCookies } from "@helpers/cookieHelpers";
import { getHomeUrl } from "@helpers/helperMethods";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/Tokens`;

export type tokenResponse = {
  access_token: string;
  expires_in: number;
  id_token: string;
};

export async function getToken() {
  const authCode = new URLSearchParams(location.search).get('code');
  if (authCode === null) {
    throw new Error("No code found in URL");
  }
  setCookie("auth_code", authCode);
  const redirectURI = getHomeUrl();
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(authCode)}/${encodeURIComponent(redirectURI)}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  setTokenCookies(await response.json());
}

export async function refreshToken() {
  const response = await fetch(BASE_URL, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export async function deleteRefreshToken() {
  const response = await fetch(BASE_URL, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }
}
