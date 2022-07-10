import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "context";
import { logout } from "utils";
import { Button, Input } from "components";
import { User, Password } from "assets/icons/icons";
import styles from "./account.module.scss";

const Account = () => {
	const navigate = useNavigate();
	const { user } = useContext(UserContext);
	useEffect(() => {
		if (Object.keys(user).length === 0) {
			navigate("/login");
		}
	}, [user, navigate]);

	return (
		<div className={styles.account}>
			<h1 className={styles.account__title}>Account</h1>
			<Input
				className={styles.account__input}
				icon={<User />}
				name="username"
				placeholder="Username"
				type="text"
				value={user.name}
				disabled
			/>
			<Input
				className={styles.account__input}
				icon={<User />}
				name="username"
				placeholder="Username"
				type="text"
				value={user.username}
				disabled
			/>
			<Input
				className={styles.account__input}
				icon={<User />}
				name="username"
				placeholder="Username"
				type="text"
				value={`${user.id}`}
				disabled
			/>
			<Button className={styles.account__logout} onClick={logout}>
				Logout
			</Button>
		</div>
	);
};

export { Account };
