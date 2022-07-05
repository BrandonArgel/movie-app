import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Back, Card, Loader, Preview, SearchBar } from "components";
import { useGetItemsAPI } from "hooks/useApi";
import styles from "./search.module.scss";

const Search = () => {
	const { search } = useLocation();
	const [query, setQuery] = useState(new URLSearchParams(search).get("search"));
	const [movies, loadingMovies, getMovies] = useGetItemsAPI([], { query });

	const onPopstate = () => {
		setQuery(new URLSearchParams(window.location.search).get("search"));
		getMovies("/search/movie", "results");
	};

	useEffect(() => {
		// Add event listener to window to listen for query changes
		window.addEventListener("popstate", onPopstate);
		getMovies("/search/movie", "results");

		return () => {
			window.removeEventListener("popstate", onPopstate);
		};
	}, [query]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<SearchBar value={query || ""} setValue={setQuery} />
			<Back button />
			<Preview title={`Results for: ${query}`}>
				{loadingMovies ? (
					<Loader />
				) : (
					<div className="grid">
						{movies.length > 0 ? (
							movies.map(
								({ adult, id, overview, title, poster_path, vote_average }) => (
									<Card
										id={id}
										key={id}
										adult={adult}
										title={title}
										overview={overview}
										link={`/movie/${id}`}
										voteAverage={vote_average}
										img={poster_path}
									/>
								)
							)
						) : (
							<p className={styles.center}>No results found.</p>
						)}
					</div>
				)}
			</Preview>
		</>
	);
};

export { Search };
