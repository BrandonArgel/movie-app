import { useState, useEffect, useCallback } from "react";
import { List, Loader, SearchBar, Slideshow, Slide, Preview } from "components";
import { useAPI } from "hooks/useApi";

const Landing = () => {
	const [query, setQuery] = useState("");
	const [movies, loadingMovies, getMovies] = useAPI([]);
	const [categories, loadingCategories, getCategories] = useAPI([]);

	const initialRequests = useCallback(() => {
		getMovies("/trending/movie/day", "results");
		getCategories("/genre/movie/list", "genres");
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		initialRequests();
	}, [initialRequests]);

	return (
		<>
			<SearchBar value={query} setValue={setQuery} />
			<Preview title="Trending Movies" link="/trending">
				<Slideshow loading={loadingMovies} speed={300}>
					{movies.map(
						({ adult, backdrop_path, id, overview, title, poster_path, vote_average }) => (
							<Slide
								id={id}
								key={id}
								adult={adult}
								title={title}
								overview={overview}
								link={`/movie/${id}`}
								voteAverage={vote_average}
								img={poster_path}
								backdrop={backdrop_path}
								slide={true}
							/>
						)
					)}
				</Slideshow>
			</Preview>
			<Preview title="Categories">
				{loadingCategories ? <Loader /> : <List items={categories} />}
			</Preview>
		</>
	);
};

export { Landing };
