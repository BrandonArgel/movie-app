import { useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "context";
import { Back, Card, Loader, Preview, SearchBar } from "components";
import { useGetItemsAPI, useInfiniteScroll } from "hooks";

const Search = () => {
	const { language, texts } = useContext(UserContext);
	const { search } = useLocation();
	const [query, setQuery] = useState(new URLSearchParams(search).get("search"));
	const [movies, loadingMovies, getMovies, getMoreMovies, hasMore] = useGetItemsAPI({
		initialValue: [],
		destruct: "results",
		msg: texts.errors.errorGet,
	});

	const lastMovieElementRef = useInfiniteScroll(
		() => getMoreMovies("/search/movie", { query, language, include_image_language: language }),
		loadingMovies,
		hasMore
	);

	const onPopstate = (lang: string) => {
		setQuery(new URLSearchParams(window.location.search).get("search"));
		getMovies("/search/movie", { query, language: lang, include_image_language: lang });
	};

	useEffect(() => {
		window.addEventListener("popstate", () => onPopstate(language));
		getMovies("/search/movie", { query, language, include_image_language: language });

		return () => {
			window.removeEventListener("popstate", () => onPopstate(language));
		};
	}, [query, language]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<SearchBar value={query || ""} setValue={setQuery} />
			<Back button />
			<Preview title={`${texts.search.title} ${query}`} grid>
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
					<>{!loadingMovies && <p className="center">{texts.infiniteScroll.noResults}</p>}</>
				)}
			</Preview>
			{loadingMovies && <Loader />}
			{!hasMore && !loadingMovies && movies.length > 0 && (
				<p className="center">{texts.infiniteScroll.limit}</p>
			)}
		</>
	);
};

export { Search };
