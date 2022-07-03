import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "assets/icons/icons";
import styles from "./searchbar.module.scss";

interface SearchBarProps {
	setValue: (value: string) => void;
	placeholder?: string;
	value: string;
}

const SearchBar = ({ setValue, placeholder, value }: SearchBarProps) => {
  const navigate = useNavigate();
	const [search, setSearch] = useState(value);
	const [error, setError] = useState(false);

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e!.currentTarget);
		const search = formData.get("search");

		if (search) {
      navigate(`/results?search=${search}`);
		} else {
      navigate(`/`);
			setError(true);
		}
	};

	return (
		<form className={`${styles.searchbar} ${error ? styles.error : ""}`} onSubmit={onSubmit}>
			<input
				type="text"
				name="search"
				placeholder={error ? "Type a movie" : placeholder || "Search"}
				className={styles.searchbar__input}
				autoComplete="off"
				value={search}
				onChange={(e) => setSearch(e.target.value.toLowerCase())}
				onKeyPress={(e) => {
					if (e.key === "Enter") {
						setValue(search);
					}
				}}
				autoFocus
			/>
			<button
				type="submit"
				className={styles.searchbar__button}
				tabIndex={-1}
				onClick={() => setValue(search)}
			>
				<SearchIcon />
			</button>
		</form>
	);
};

export { SearchBar };
