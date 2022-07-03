import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, Loader, Preview, SearchBar } from "components";
import { useAPI } from "hooks/useApi";
import styles from "./search.module.scss";

const Search = () => {
	const { search } = useLocation();
	const [query, setQuery] = useState(new URLSearchParams(search).get("search"));
	const [movies, loadingMovies, getMovies] = useAPI([], { query });

	const updateQuery = (query: string) => {
		setQuery(query);
		window.history.pushState({}, "", `/results?search=${query}`);
	};

	useEffect(() => {
		getMovies("/search/movie", "results");
    console.log(movies);
	}, [query]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<SearchBar value={query || ""} setValue={updateQuery} />
			<Preview title={`Results for: ${query}`}>
				{loadingMovies ? (
					<Loader />
				) : (
					<div className="grid">
						{movies.length > 0 ? (
							movies.map(
								({ adult, backdrop_path, id, overview, title, poster_path, vote_average }) => (
									<Card
										id={id}
										key={id}
										adult={adult}
										title={title}
										overview={overview}
										link={`/movie/${id}`}
										voteAverage={vote_average}
										img={poster_path}
										backdrop={backdrop_path}
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
