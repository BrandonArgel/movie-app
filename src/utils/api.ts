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

export const login = async (username: string, password: string, request_token: string, msg: string) => {
  const data = await api
    .post("/authentication/token/validate_with_login", {
      request_token,
      username,
      password,
    })
    .then((res) => res.data)
    .catch((err) => {
      Toast.fire({
        icon: "error",
        title: msg,
      })
      return err;
    })

  if (data?.success) {
    window.localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, data.request_token);
    return data
  }
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
    // Reload the page for localStorage updates to be reflected
    window.location.reload();
  }

  return data.session_id;
}

export const getAccount = async (session_id: string) => await api.get("/account", { params: { session_id } }).then((res) => res.data);

interface toggleFavoriteParams {
  account_id: number;
  movie_id: number;
  favorite: boolean;
  add: boolean;
  remove: boolean;
  err: string;
  session_id: string;
}

export const toggleFavorite = async ({ account_id, session_id, movie_id, favorite, add, remove, err }: toggleFavoriteParams) => {
  return await api
    .post(
      `/account/${account_id}/favorite`,
      { media_type: "movie", movie_id, favorite: !favorite },
      { params: { session_id } }
    )
    .then((res) => res.data)
    .then((data) => {
      if (data?.success) {
        Toast.fire({
          icon: "success",
          title: favorite ? remove : add,
        });
        return data;
      }
    })
    .catch((e) =>
      Toast.fire({
        icon: "error",
        title: `${err}: ${e.message}`,
      })
    );
}

interface toggleWatchlaterParams {
  account_id: number;
  media_id: number;
  watchlater: boolean;
  add: boolean;
  remove: boolean;
  err: string;
  session_id: string;
}

export const toggleWatchlater = async ({ account_id, session_id, media_id, watchlater, add, remove, err }: toggleWatchlaterParams) => {
  return await api
    .post(
      `/account/${account_id}/watchlist`,
      { media_type: "movie", media_id, watchlist: !watchlater },
      { params: { session_id } }
    )
    .then((res) => res.data)
    .then((data) => {
      if (data?.success) {
        Toast.fire({
          icon: "success",
          title: watchlater ? remove : add,
        });
        return data;
      }
    }).catch((e) =>
      Toast.fire({
        icon: "error",
        title: `${err}: ${e.message}`,
      })
    );
}

interface rateMovieParams {
  err: string;
  movie_id: number;
  session_id: string;
  success: string;
  value: number;
}

export const rateMovie = async ({ movie_id, session_id, value, success, err }: rateMovieParams) => {
  return await api
    .post(`/movie/${movie_id}/rating`, { value }, { params: { session_id } })
    .then((res) => res.data)
    .then((data) => {
      if (data?.success) {
        Toast.fire({
          icon: "success",
          title: success,
        });
        return data;
      }
    })
    .catch((e) =>
      Toast.fire({
        icon: "error",
        title: `${err}: ${e.message}`,
      })
    );
}

interface deleteRateMovieParams {
  err: string;
  movie_id: number;
  session_id: string;
  success: string;
}

export const deleteRateMovie = async ({ movie_id, session_id, success, err }: deleteRateMovieParams) => {
  return await api
    .delete(`/movie/${movie_id}/rating`, { params: { session_id } })
    .then((res) => res.data)
    .then((data) => {
      if (data?.success) {
        Toast.fire({
          icon: "success",
          title: success,
        });
        return data;
      }
    }).catch((e) =>
      Toast.fire({
        icon: "error",
        title: `${err}: ${e.message}`,
      })
    );
}