import { getAuthToken } from './authToken';

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function networkFailureMessage(cause: unknown): string {
  const raw = cause instanceof Error ? cause.message : String(cause ?? '');
  if (/failed to fetch|networkerror|load failed|ssl|certificate|ERR_CERT/i.test(raw)) {
    return (
      'Не удалось связаться с API (сеть/HTTPS). ' +
      'Если сайт открывается, а регистрация нет — проверь, что на fit-rpg.ru установлен доверенный сертификат (Let’s Encrypt), а не самоподписанный.'
    );
  }
  return 'Не удалось связаться с сервером. Проверь сеть и HTTPS.';
}

export async function httpClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${baseUrl}${path}`;
  const token = getAuthToken();
  let res: Response;
  try {
    res = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
      },
      ...options,
    });
  } catch (cause) {
    throw new ApiError(networkFailureMessage(cause), 0);
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(
      (err as { error?: string }).error ?? `HTTP ${res.status}`,
      res.status,
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
