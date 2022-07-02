import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { List, Loader, Slideshow, Slide, Preview } from "components";

const { REACT_APP_API_KEY } = process.env;

const Landing = () => {
	const [movies, setMovies] = useState([]);
	const [loadingMovies, setLoadingMovies] = useState(true);
	const [categories, setCategories] = useState([]);
	const [loadingCategories, setLoadingCategories] = useState(true);

	const initialRequest = useCallback(async () => {
		setLoadingMovies(true);
		setLoadingCategories(true);
		await fetch("https://api.themoviedb.org/3/trending/movie/day?api_key=" + REACT_APP_API_KEY)
			.then((res) => res.json())
			.then((data) => setMovies(data.results))
			.catch((err) => console.log(err))
			.finally(() => setLoadingMovies(false));

		await fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=" + REACT_APP_API_KEY)
			.then((res) => res.json())
			.then((data) => setCategories(data.genres))
			.catch((err) => console.log(err))
			.finally(() => setLoadingCategories(false));
	}, []);

	useEffect(() => {
		initialRequest();
	}, [initialRequest]);

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

export default Landing;
