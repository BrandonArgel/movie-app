import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Back, Card, Loader, Preview, SearchBar } from "components";
import { useGetItemsAPI, useInfiniteScroll } from "hooks";

const Search = () => {
	const { search } = useLocation();
	const [query, setQuery] = useState(new URLSearchParams(search).get("search"));
	const [movies, loadingMovies, getMovies, getMoreMovies, hasMore] = useGetItemsAPI({
		initialValue: [],
		destruct: "results",
	});

	const lastMovieElementRef = useInfiniteScroll(
		() => getMoreMovies("/search/movie", { query }),
		loadingMovies,
		hasMore
	);

	const onPopstate = () => {
		setQuery(new URLSearchParams(window.location.search).get("search"));
		getMovies("/search/movie", { query });
	};

	useEffect(() => {
		window.addEventListener("popstate", onPopstate);
		getMovies("/search/movie", { query });

		return () => {
			window.removeEventListener("popstate", onPopstate);
		};
	}, [query]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<SearchBar value={query || ""} setValue={setQuery} />
			<Back button />
			<Preview title={`Results for: ${query}`} grid>
				{movies.length > 0 ? (
					movies.map(({ adult, id, overview, title, poster_path, vote_average }, i) => (
						<div key={id} ref={i === movies.length - 1 ? lastMovieElementRef : null}>
							<Card
								id={id}
								title={title}
								adult={adult}
								img={poster_path}
								overview={overview}
								link={`/movie/${id}`}
								voteAverage={vote_average}
							/>
						</div>
					))
				) : (
					<>{!loadingMovies && <p className="center">No results found.</p>}</>
				)}
			</Preview>
			{loadingMovies && <Loader />}
			{!hasMore && !loadingMovies && movies.length > 0 && (
				<p className="center">It seems there are no more results.</p>
			)}
		</>
	);
};

export { Search };
