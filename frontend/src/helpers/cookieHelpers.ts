import { tokenResponse } from "@api/UserApi";

export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts: string[] = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

export const setCookie = (name: string, value: string, seconds?: number) => {
  document.cookie = seconds
    ? (document.cookie = `${name}=${value}; Max-Age=${seconds};`)
    : `${name}=${value};`;
};

export const deleteCookie = (name: string) => {
  document.cookie = name + "=; Max-Age=-9999999999;";
};

export function setTokenCookies(data: tokenResponse | undefined) {
  if (data === undefined) {
      return;
  }
  const { access_token, id_token, expires_in } = data;
  setCookie('access_token', access_token, expires_in);
  setCookie('JWT', id_token, expires_in);
  deleteCookie('auth_code');
  location.href = "/";
}
