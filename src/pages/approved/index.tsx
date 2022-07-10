import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { UserContext } from "context";
import { Button } from "components";
import { useCountdown } from "hooks";
import styles from "./approved.module.scss";

const Approved = () => {
	const { setToken } = useContext(UserContext);
	const navigate = useNavigate();
	const { search } = useLocation();
	const requestToken = new URLSearchParams(search).get("request_token");
	const [timer, setIsRunning] = useCountdown(10);
	const onRedirect = () => {
		navigate("/");
	};

	useEffect(() => {
		if (requestToken) setToken(requestToken);
	}, [requestToken]); // eslint-disable-line

	useEffect(() => {
		if (timer === 0) {
			setIsRunning(false);
			onRedirect();
		}
	}, [timer, setIsRunning]); // eslint-disable-line

	return (
		<div className={styles.approved}>
			<h1 className={styles.approved__title}>Approved</h1>
			<p className={styles.approved__description}>
				Thank you for granting us access to your data. You can now use the app.
			</p>
			<p className={styles.approved__info}>Redirecting to home in {timer} seconds...</p>
			<Button className={styles.approved__button} onClick={() => onRedirect()}>
				Go to home
			</Button>
		</div>
	);
};

export { Approved };
