import { Link } from "react-router-dom";
import styles from "./header.module.scss";

const Header = () => {
	// TODO: when the user is logged in, show the user's avatar and a logout button

	return (
		<header className={styles.header}>
			<h1 className={styles.header__logo}>
				<Link to="/">Movies App</Link>
			</h1>
			<nav>
				<ul className={styles.header__list}>
					<li className={styles.header__list_item}>
						<Link to="/login">Login</Link>
					</li>
					<li className={styles.header__list_item}>
						<Link className="button" to="/register">
							Register
						</Link>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export { Header };
