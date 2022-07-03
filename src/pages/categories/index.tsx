import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Loader, Preview } from "components";
import { useAPI } from "hooks/useApi";

const BASE_URL = "https://api.themoviedb.org/3";

const Categories = () => {
	const { id, name } = useParams();
	const [movies, loadingMovies, getMovies] = useAPI(BASE_URL, [], { with_genres: id });

	useEffect(() => {
		getMovies(`/discover/movie`, "results");
	}, [id]);

	return (
		<>
			<Preview title={`Category ${name?.charAt(0).toUpperCase()}${name?.slice(1)}`} breadcrumb>
				{loadingMovies ? (
					<Loader />
				) : (
					<div className="grid">
						{movies.map(({ adult, id, overview, title, poster_path, vote_average }) => (
							<Card
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
					</div>
				)}
			</Preview>
		</>
	);
};

export { Categories };
