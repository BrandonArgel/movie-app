import { useContext } from "react";
import { ThemeContext } from "context";
import { Sun, Moon } from "assets/icons/icons";
import styles from "./buttonTheme.module.scss";

const ButtonTheme = () => {
	const { theme, toggleTheme } = useContext(ThemeContext);

	return (
		<button
			className={styles.theme__btn}
			onClick={() => toggleTheme()}
			title={theme === "light" ? "Dark theme" : "Light theme"}
			type="button"
		>
			{theme === "dark" ? <Sun /> : <Moon />}
		</button>
	);
};

export { ButtonTheme };
