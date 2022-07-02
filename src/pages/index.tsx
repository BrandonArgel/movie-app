import { useState, useEffect, useCallback } from "react";
import { Slideshow, Slide } from "components";

const { REACT_APP_API_KEY } = process.env;

const Landing = () => {
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(true);

	const initialRequest = useCallback(async () => {
		setLoading(true);
		const res = await fetch(
			"https://api.themoviedb.org/3/trending/movie/day?api_key=" + REACT_APP_API_KEY
		);
		const data = await res.json();
		console.log(data.results[0]);
		setMovies(data.results);
	}, []);

	useEffect(() => {
		initialRequest();
	}, [initialRequest]);

	return (
		<Slideshow speed={400}>
			{movies.map(({ adult, id, overview, title, poster_path, vote_average }) => (
				<Slide
					id={id}
					key={id}
					adult={adult}
					title={title}
          overview={overview}
					link={`/movie/${id}`}
					voteAverage={vote_average}
					img={`https://image.tmdb.org/t/p/w500/${poster_path}`}
				/>
			))}
		</Slideshow>
	);
};

export default Landing;
