import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Loader, Preview } from "components";
import { useAPI } from "hooks/useApi";

const Categories = () => {
	// TODO: Implement pagination
	const { id, name } = useParams();
	const [movies, loadingMovies, getMovies] = useAPI([], { with_genres: id });

	useEffect(() => {
		getMovies(`/discover/movie`, "results");
	}, [id]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Preview title={`Category ${name?.charAt(0).toUpperCase()}${name?.slice(1)}`}>
				{loadingMovies ? (
					<Loader />
				) : (
					<div className="grid">
						{movies.map(
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
						)}
					</div>
				)}
			</Preview>
		</>
	);
};

export { Categories };
