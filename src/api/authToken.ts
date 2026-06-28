const AUTH_TOKEN_KEY = 'pr_auth_token';

let authToken: string | null = null;

export function initAuthToken(): void {
  authToken = sessionStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string | null): void {
  authToken = token;
  if (token) {
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export function getAuthToken(): string | null {
  return authToken ?? sessionStorage.getItem(AUTH_TOKEN_KEY);
}
