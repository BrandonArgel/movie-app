import { useEffect, useCallback } from "react";
import { List, Loader, Slideshow, Slide, Preview } from "components";
import { useAPI } from "hooks/useApi";

const BASE_URL = "https://api.themoviedb.org/3";

const Landing = () => {
	const [movies, loadingMovies, getMovies] = useAPI(BASE_URL, []);
	const [categories, loadingCategories, getCategories] = useAPI(BASE_URL, []);

	const initialRequests = useCallback(() => {
		getMovies("/trending/movie/day", "results");
		getCategories("/genre/movie/list", "genres");
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		initialRequests();
	}, [initialRequests]);

	return (
		<>
			<Preview title="Trending Movies" link="/trending">
				<Slideshow loading={loadingMovies} speed={300}>
					{movies.map(({ adult, id, overview, title, poster_path, vote_average }) => (
						<Slide
							id={id}
							key={id}
							adult={adult}
							title={title}
							overview={overview}
							link={`/movie/${id}`}
							voteAverage={vote_average}
							img={`https://image.tmdb.org/t/p/w200/${poster_path}`}
							slide={true}
						/>
					))}
				</Slideshow>
			</Preview>
			<Preview title="Categories">
				{loadingCategories ? <Loader /> : <List items={categories} />}
			</Preview>
		</>
	);
};

export { Landing };
