import { createContext, useEffect, useState } from "react";
import { useLocalStorage } from "hooks";
import { getAccount, getSessionId } from "utils";

// type userType = {
// 	[key: string]: any;
// };

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
	token: "",
	setToken: (data: string) => {},
	sessionId: "",
	setSessionId: (data: string) => {},
});

const UserProvider = ({ children }: propsUserProvider) => {
	const [token, setToken] = useLocalStorage("token_request_tmdb", "");
	const [sessionId, setSessionId] = useState("");
	const [user, setUser] = useState({ name: "", username: "", avatar: "", id: 0 });

	const initialRequest = async () => {
		try {
			const session_id = await getSessionId(token);
			setSessionId(session_id);

			const data = await getAccount(session_id);
			const { id, username, name } = data;
			const avatar = data.avatar.gravatar.hash;
			const user = { id, username, name, avatar };
			setUser(user);
		} catch (err) {
			// Sweet alert: We need you to login again
			// Redirect to login page
			console.log(err);
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
