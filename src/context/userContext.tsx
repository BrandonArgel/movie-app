import { createContext, useEffect, useState } from "react";
import { useLocalStorage } from "hooks";
import { getAccount, getSessionId, Toast } from "utils";
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
});

const UserProvider = ({ children }: propsUserProvider) => {
	const [token, setToken] = useLocalStorage("token_request_tmdb", "");
	const [language, setLanguage] = useLocalStorage("language_tmdb", initialLanguage);
	const [texts, setTexts] = useState(translations[language as keyof typeof translations]);
	const [sessionId, setSessionId] = useState("");
	const [user, setUser] = useState({ name: "", username: "", avatar: "", id: 0 });

	const handleLanguage = (lang: string) => {
		setLanguage(lang);
		setTexts(translations[lang as keyof typeof translations]);
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
			});
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
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export { UserContext, UserProvider };
