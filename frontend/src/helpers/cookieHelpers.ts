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
