const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/Tokens`;

export type tokenResponse = {
  access_token: string;
  expires_in: number;
  id_token: string;
};

export async function getTokens(redirect_uri: string): Promise<tokenResponse> {
  const params = new URLSearchParams(location.search);
  if (params.get('code') === null) {
    throw new Error("No code found in URL");
  }
  const code = encodeURIComponent(params.get('code')!);
  const uri = encodeURIComponent(redirect_uri);
  const response = await fetch(`${BASE_URL}/${code}/${uri}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export async function refreshTokens() {
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
