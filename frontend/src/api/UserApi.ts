const BASE_URL = `${import.meta.env.VITE_backend_URL}/Tokens`;

export type tokenResponse = {
  access_token: string;
  expires_in: number;
  id_token: string;
};

export async function getTokens(auth_code: string, redirect_uri: string) {
  try {
    const code = encodeURIComponent(auth_code);
    const uri = encodeURIComponent(redirect_uri);
    const response = await fetch(`${BASE_URL}/${code}/${uri}`, {
      headers: {
        Accept: "application/json",
      },
    });

    const responseAsJson = await response.json();
    if (responseAsJson !== undefined && response.ok) {
      return responseAsJson as tokenResponse;
    }
    console.log(responseAsJson);
  } catch (error) {
    console.error(error);
  }
}

export async function refreshTokens() {
  try {
    const response = await fetch(BASE_URL);

    const responseAsJson = await response.json();
    if (responseAsJson != undefined && response.ok) {
      return responseAsJson as tokenResponse;
    }
    throw new Error("refresh token not found");
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
