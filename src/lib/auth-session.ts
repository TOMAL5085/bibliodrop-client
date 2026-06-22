import type { AppRole } from "@/lib/auth-user";

export type StoredAuthUser = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  photoUrl?: string;
};

type AuthSessionPayload = {
  user: StoredAuthUser | null;
  token: string | null;
};

const authTokenKey = "bibliodrop_auth_token";
const authUserKey = "bibliodrop_auth_user";
const authSessionEvent = "bibliodrop-auth-session-changed";

function safeJsonParse<T>(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function getStoredAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(authTokenKey);
}

export function getStoredAuthUser() {
  if (typeof window === "undefined") {
    return null;
  }

  return safeJsonParse<StoredAuthUser>(window.localStorage.getItem(authUserKey));
}

export function getStoredAuthSession(): AuthSessionPayload {
  return {
    user: getStoredAuthUser(),
    token: getStoredAuthToken(),
  };
}

function persistAuthSession(session: AuthSessionPayload) {
  if (typeof window === "undefined") {
    return;
  }

  if (session.token) {
    window.localStorage.setItem(authTokenKey, session.token);
  } else {
    window.localStorage.removeItem(authTokenKey);
  }

  if (session.user) {
    window.localStorage.setItem(authUserKey, JSON.stringify(session.user));
  } else {
    window.localStorage.removeItem(authUserKey);
  }

  window.dispatchEvent(new Event(authSessionEvent));
}

export function setStoredAuthSession(session: AuthSessionPayload) {
  persistAuthSession(session);
}

export function clearStoredAuthSession() {
  persistAuthSession({ user: null, token: null });
}

export function subscribeAuthSessionChange(listener: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === authTokenKey || event.key === authUserKey) {
      listener();
    }
  };

  window.addEventListener(authSessionEvent, listener);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(authSessionEvent, listener);
    window.removeEventListener("storage", handleStorage);
  };
}
