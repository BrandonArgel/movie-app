import { createContext, useEffect, useState } from "react";
import { useLocalStorage } from "hooks";
import {
	getAccount,
	getSessionId,
	Toast,
	rateMovie,
	toggleFavorite,
	toggleWatchlater,
	deleteRateMovie,
} from "utils";
import translationsRaw from "translations.json";
const initialLanguage = "en-US";
const translations = JSON.parse(JSON.stringify(translationsRaw));

type wildcardProps = {
	[key: string]: any;
};

type userType = {
	name: string;
	username: string;
	avatar: string;
	id: number;
};

interface propsUserProvider {
	children: React.ReactNode;
}

interface handleFavoriteProps {
	movie_id: number;
	favorite: boolean;
}

interface handleWatchLaterProps {
	media_id: number;
	watchlater: boolean;
}

interface handleRatingProps {
	movie_id: number;
	value: number;
}

interface handleDeleteRatingProps {
	movie_id: number;
}

const UserContext = createContext({
	user: {} as userType,
	setUser: (data: userType) => {},
	language: "",
	setLanguage: (data: string) => {},
	texts: {} as wildcardProps,
	token: "",
	setToken: (data: string) => {},
	sessionId: "",
	setSessionId: (data: string) => {},
	popup: "",
	setPopup: (data: string) => {},
	handleFavorite: (data: handleFavoriteProps): any => {},
	handleWatchlater: (data: handleWatchLaterProps): any => {},
	handleRating: (data: handleRatingProps): any => {},
	handleDeleteRating: (data: handleDeleteRatingProps): any => {},
});

const UserProvider = ({ children }: propsUserProvider) => {
	const [token, setToken] = useLocalStorage("token_request_tmdb", "");
	const [language, setLanguage] = useLocalStorage("language_tmdb", initialLanguage);
	const [texts, setTexts] = useState(translations[language as keyof typeof translations]);
	const [sessionId, setSessionId] = useState("");
	const [user, setUser] = useState({ name: "", username: "", avatar: "", id: 0 });
	const [popup, setPopup] = useState("");

	// Function to change language
	const handleLanguage = (lang: string) => {
		setLanguage(lang);
		setTexts(translations[lang as keyof typeof translations]);
	};

	// Function to launch a toast with the message login needed
	const handleLoginNeeded = () => {
		Toast.fire({
			icon: "success",
			title: texts.messages.needLogin,
		});
	};

	// Function to toggle favorite
	const handleFavorite = async ({ movie_id, favorite }: handleFavoriteProps) => {
		if (!sessionId) {
			handleLoginNeeded();
			return;
		}
		const res = await toggleFavorite({
			movie_id,
			favorite,
			add: texts.messages.addFavorite,
			remove: texts.messages.removeFavorite,
			err: texts.errors.errorFavorite,
			session_id: sessionId,
			account_id: user.id,
		});

		return res;
	};

	// Function to toggle watchlater
	const handleWatchlater = async ({ media_id, watchlater }: handleWatchLaterProps) => {
		if (!sessionId) {
			handleLoginNeeded();
			return;
		}
		const res = await toggleWatchlater({
			media_id,
			watchlater,
			add: texts.messages.addWatchlater,
			remove: texts.messages.removeWatchlater,
			err: texts.errors.errorPost,
			session_id: sessionId,
			account_id: user.id,
		});

		return res;
	};

	const handleRating = async ({ movie_id, value }: handleRatingProps) => {
		if (!sessionId) {
			handleLoginNeeded();
			return;
		}
		const res = await rateMovie({
			movie_id,
			value: value / 10,
			session_id: sessionId,
			success: texts.messages.rateMovie,
			err: texts.errors.errorPost,
		});

		return res;
	};

	const handleDeleteRating = async ({ movie_id }: handleDeleteRatingProps) => {
		const res = await deleteRateMovie({
			movie_id,
			session_id: sessionId,
			success: texts.messages.unrateMovie,
			err: texts.errors.errorPost,
		});

		return res;
	};

	const initialRequest = async () => {
		try {
			const session_id = await getSessionId(token);
			setSessionId(session_id);

			const data = await getAccount(session_id);
			const { id, username, name } = data;
			const avatar = data.avatar.gravatar.hash;
			const user = { id, username, name, avatar };
			setUser(user);

			Toast.fire({
				icon: "success",
				title: `${texts.messages.welcome} ${name}!`,
			});
		} catch (err) {
			Toast.fire({
				icon: "error",
				title: texts.errors.errorLogin,
			}).then(() => console.log(err));
		}
	};

	useEffect(() => {
		if (token) {
			initialRequest();
		}
	}, [token]); // eslint-disable-line

	return (
		<UserContext.Provider
			value={{
				user,
				setUser,
				language,
				setLanguage: handleLanguage,
				texts,
				token,
				setToken,
				sessionId,
				setSessionId,
				popup,
				setPopup,
				handleFavorite,
				handleWatchlater,
				handleRating,
				handleDeleteRating,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export { UserContext, UserProvider };
