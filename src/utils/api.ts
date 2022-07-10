import { api } from "utils"


const LOCALSTORAGE_KEYS = {
  accessToken: "token_request_tmdb",
  sessionId: "session_id_tmdb",
};

// Map to retrieve localStorage values
const LOCALSTORAGE_VALUES = {
  accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  sessionId: window.localStorage.getItem(LOCALSTORAGE_KEYS.sessionId),
};

/**
 * Clear out all localStorage items we've set and reload the page
 * @returns {void}
 */
export const logout = async () => {
  const session_id = JSON.parse(LOCALSTORAGE_VALUES.sessionId as string);
  console.log({ session_id });
  const data = await api
    .delete("/authentication/session", { data: { session_id } })
    .then((res) => res.data)
    .catch((err) => console.log(err))

  if (data.success && LOCALSTORAGE_VALUES.accessToken && LOCALSTORAGE_VALUES.sessionId) {
    Object.keys(LOCALSTORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(LOCALSTORAGE_KEYS[key as keyof typeof LOCALSTORAGE_KEYS]);
    }
    );
  }

  console.log("logout", data);

  window.location.href = "/";
}

export const getSessionId = async (request_token: string) => {
  const session_id = JSON.parse(LOCALSTORAGE_VALUES.sessionId as string);

  if (session_id && session_id.length > 0) {
    return session_id;
  }

  const data = await api.post("/authentication/session/new", { request_token }).then((res) => res.data);
  console.log("getSessionId", data);

  if (data.success) {
    window.localStorage.setItem(LOCALSTORAGE_KEYS.sessionId, JSON.stringify(data.session_id));
  }

  return data.session_id;
}

export const getAccount = async (session_id: string) => await api.get("/account", { params: { session_id } }).then((res) => res.data);
