import { createContext, useEffect } from "react";
import { useLocalStorage } from "hooks";

const initialTheme = "dark";

interface propsThemeProvider {
	children: React.ReactNode;
}

const ThemeContext = createContext({
	theme: "",
	toggleTheme: () => {},
});

const ThemeProvider = ({ children }: propsThemeProvider) => {
	const [theme, setTheme] = useLocalStorage("theme_tmdb", initialTheme);

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
		document.body.classList.toggle("dark");
		document.body.classList.toggle("light");
	};

	useEffect(() => {
		document.body.classList.add(theme);
	}, []); // eslint-disable-line

	return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export { ThemeContext, ThemeProvider };
