// import { useNavigate } from "react-router-dom";
// import { useContext, useEffect, useState } from "react";
// import { UserContext } from "context";
// import { Button } from "components";
// import { useGetItemAPI } from "hooks";
// import styles from "./login.module.scss";

// const Login = () => {
// 	const navigate = useNavigate();
// 	const { token, texts } = useContext(UserContext);
// 	const [loadingToken, getToken] = useGetItemAPI({
// 		path: "/authentication/token/new",
// 		msg: texts.errors.errorGet,
// 	});
// 	const [loading, setLoading] = useState(loadingToken);
// 	const [error, setError] = useState("");

// 	const onRedirect = async () => {
// 		try {
// 			setLoading(true);
// 			const res = await getToken();
// 			if (res?.success) {
// 				window.location.href = `https://www.themoviedb.org/authenticate/${res.request_token}?redirect_to=https://movies-platzi-app.netlify.app/approved`;
// 			} else {
// 				setError("An error occurred, please try again.");
// 			}
// 		} catch (err) {
// 			setError("An error occurred, please try again.");
// 			setLoading(false);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	useEffect(() => {
// 		if (token) {
// 			navigate("/");
// 		}
// 	}, [token, navigate]);

// 	return (
// 		<div className={styles.login}>
// 			<h1 className={styles.login__title}>{texts.login.title}</h1>
// 			<p className={styles.login__description}>{texts.login.info}</p>
// 			<Button
// 				className={`${styles.login__submit}`}
// 				disabled={loading}
// 				onClick={() => onRedirect()}
// 				loading={loading}
// 			>
// 				{texts.login.button}
// 			</Button>
// 			{error && <p className={styles.login__error}>{error}</p>}
// 		</div>
// 	);
// };

import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "context";
import { Button, Input } from "components";
import { login, Toast } from "utils";
import { useGetItemAPI } from "hooks";
import { User, Password } from "assets/icons/icons";
import styles from "./login.module.scss";

const Login = () => {
	const navigate = useNavigate();
	const { setToken, texts } = useContext(UserContext);
	const [loadingToken, getToken] = useGetItemAPI({
		path: "/authentication/token/new",
		msg: texts.errors.errorGet,
	});
	const [token, setTokenValue] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(loadingToken);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			setLoading(true);
			const res = await login(username, password, token, texts.errors.login);
			console.log(res, "login");
			if (res.success) {
				setToken(res.request_token);
				Toast.fire({
					icon: "success",
					title: texts.login.success,
				});
				navigate("/");
			}
		} catch (err) {
			setError(texts.errors.errorLogin);
		} finally {
			setLoading(false);
		}
	};

	const initialRequest = async () => {
		const res = await getToken();
		if (res.success) {
			setTokenValue(res.request_token);
		}
	};

	useEffect(() => {
		initialRequest();
	}, []); // eslint-disable-line

	return (
		<div className={styles.login}>
			<h1 className={styles.login__title}>{texts.login.title}</h1>
			<p className={styles.login__description}>{texts.login.description}</p>
			<form className={styles.login__form} onSubmit={handleSubmit}>
				<Input
					icon={<User />}
					name="username"
					onChange={(e) => setUsername(e.target.value)}
					placeholder={texts.login.username}
					type="text"
					value={username}
					error={error}
					autocomplete="username"
				/>
				<Input
					icon={<Password />}
					name="password"
					onChange={(e) => setPassword(e.target.value)}
					placeholder={texts.login.password}
					type="password"
					value={password}
					error={error}
					autocomplete="current-password"
				/>
				{error && <p className={styles.login__error}>{error}</p>}
				<Button
					className={`${styles.login__submit}`}
					disabled={loading}
					loading={loading}
					type="submit"
				>
					{texts.login.button}
				</Button>
			</form>
		</div>
	);
};

export { Login };
