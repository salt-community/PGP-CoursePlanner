import { getCookie, setCookie, setTokenCookies } from "@helpers/cookieHelpers";
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
  const accessToken = getCookie("access_token"); 

  const response = await fetch(BASE_URL, {
    method: 'PUT',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({access_token: accessToken}) 
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await response.json();
  const { access_token, id_token } = data;

  setCookie("access_token", access_token, 72000);
  setCookie("id_token", id_token, 72000);

  return data; 
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
