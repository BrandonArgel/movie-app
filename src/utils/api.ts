import { api, Toast } from "utils"


const LOCALSTORAGE_KEYS = {
  accessToken: "token_request_tmdb",
  sessionId: "session_id_tmdb",
};

// Map to retrieve localStorage values
const LOCALSTORAGE_VALUES = {
  accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  sessionId: window.localStorage.getItem(LOCALSTORAGE_KEYS.sessionId),
};

export const logout = async (msgSuccess: string, msgError: string) => {
  const session_id = JSON.parse(LOCALSTORAGE_VALUES.sessionId as string);
  const data = await api
    .delete("/authentication/session", { data: { session_id } })
    .then((res) => res.data)
    .catch((err) => Toast.fire({
      icon: "error",
      title: msgError,
    }).then(() => console.log(err)))

  if (data?.success && LOCALSTORAGE_VALUES.accessToken && LOCALSTORAGE_VALUES.sessionId) {
    Object.keys(LOCALSTORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(LOCALSTORAGE_KEYS[key as keyof typeof LOCALSTORAGE_KEYS]);
    }
    );
  }

  Toast.fire({
    icon: "success",
    title: msgSuccess,
  });

  window.location.href = "/";
}

export const getSessionId = async (request_token: string) => {
  const session_id = JSON.parse(LOCALSTORAGE_VALUES.sessionId as string);

  if (session_id && session_id.length > 0) {
    return session_id;
  }

  const data = await api.post("/authentication/session/new", { request_token })
    .then((res) => res.data)

  if (data?.success) {
    window.localStorage.setItem(LOCALSTORAGE_KEYS.sessionId, JSON.stringify(data.session_id));
    window.location.reload();
  }

  return data.session_id;
}

export const getAccount = async (session_id: string) => await api.get("/account", { params: { session_id } }).then((res) => res.data);

type msgProps = {
  add: string,
  remove: string
}

export const toggleFavorite = async (session_id: string, movie_id: number, favorite: boolean, msg: msgProps) => {
  console.log(msg);
  const data = await api.post("/account/{account_id}/favorite", { media_type: "movie", movie_id, favorite }, { params: { session_id } }).then((res) => res.data);
  if (data?.success) {
    Toast.fire({
      icon: "success",
      title: favorite ? msg.add : msg.remove,
    });
    return Boolean(favorite);
  }
}