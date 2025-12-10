const ACCESS_KEY = "access_token";

export function setAccessToken(token: string | null) {
  if (token == null) {
    localStorage.removeItem(ACCESS_KEY);
  } else {
    localStorage.setItem(ACCESS_KEY, token);
  }
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY);
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_KEY);
}
