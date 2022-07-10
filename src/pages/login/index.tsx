import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "context";
import { Button } from "components";
import { useGetItemAPI } from "hooks";
import styles from "./login.module.scss";

const Login = () => {
	const navigate = useNavigate();
	const { token, texts } = useContext(UserContext);
	const [loadingToken, getToken] = useGetItemAPI({
		path: "/authentication/token/new",
		msg: texts.errors.errorGet,
	});
	const [loading, setLoading] = useState(loadingToken);
	const [error, setError] = useState("");

	const onRedirect = async () => {
		try {
			setLoading(true);
			const res = await getToken();
			if (res.success) {
				// window.location.href = `https://www.themoviedb.org/authenticate/${res.request_token}?redirect_to=https://movies-platzi-app.netlify.app/approved`;
				window.location.href = `https://www.themoviedb.org/authenticate/${res.request_token}?redirect_to=https://localhost:3000/approved`;
			} else {
				setError("An error occurred, please try again.");
			}
		} catch (err) {
			setError("An error occurred, please try again.");
			setLoading(false);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (token) {
			navigate("/");
		}
	}, [token, navigate]);

	return (
		<div className={styles.login}>
			<h1 className={styles.login__title}>{texts.login.title}</h1>
			<p className={styles.login__description}>{texts.login.info}</p>
			<Button
				className={`${styles.login__submit}`}
				disabled={loading}
				onClick={() => onRedirect()}
				loading={loading}
			>
				{texts.login.button}
			</Button>
			{error && <p className={styles.login__error}>{error}</p>}
		</div>
	);
};

// const Login = () => {
// 	const [loadingToken, getToken] = useGetItemAPI({
// 		path: "/authentication/token/new",
// 	});
// 	const [username, setUsername] = useState({
// 		value: "",
// 		error: "",
// 	});
// 	const [password, setPassword] = useState({
// 		value: "",
// 		error: "",
// 	});
// 	const [loading, setLoading] = useState(loadingToken);
// 	const [error, setError] = useState("");

// 	const initialRequest = async () => {
// 		try {
// 			setLoading(true);
// 			const res = await getToken();
// 			if (res.success) {
// 				console.log({ res });
// 				setTimeout(() => {
// 					window.location.href = `https://www.themoviedb.org/authenticate/${res.request_token}?redirect_to=http://localhost:3000/approved`;
// 				}, 2000);
// 			} else {
// 				setError("Invalid username or password, make sure you are using your The Movie DB account");
// 			}
// 		} catch (err) {
// 			console.log(err);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	useEffect(() => {
// 		initialRequest();
// 	}, []);

// 	return (
// 		<div className={styles.login}>
// 			<h1 className={styles.login__title}>Login</h1>
// 			<form className={styles.login__form}>
// 				<Input
// 					icon={<User />}
// 					name="username"
// 					onChange={(e) => setUsername({ value: e.target.value, error: "" })}
// 					placeholder="Enter your username"
// 					type="text"
// 					value={username.value}
// 					error={username.error}
// 					autocomplete="username"
// 				/>
// 				<Input
// 					icon={<Password />}
// 					name="password"
// 					onChange={(e) => setPassword({ value: e.target.value, error: "" })}
// 					placeholder="Enter your password"
// 					type="password"
// 					value={password.value}
// 					error={password.error}
// 					autocomplete="current-password"
// 				/>
// 				{error && <p className={styles.login__error}>{error}</p>}
// 				<button className={`${styles.login__submit} button`} type="submit" disabled={loading}>
// 					{loading ? <Loader /> : "Login"}
// 				</button>
// 			</form>
// 		</div>
// 	);
// };

export { Login };
