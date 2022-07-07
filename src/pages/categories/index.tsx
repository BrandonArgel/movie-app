import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Back, Card, Loader, Preview } from "components";
import { useGetItemsAPI } from "hooks/useApi";

const Categories = () => {
	// TODO: Implement pagination
	const { id, name } = useParams();
	const [movies, loadingMovies, getMovies] = useGetItemsAPI([], { with_genres: id });

	useEffect(() => {
		getMovies(`/discover/movie`, "results");
	}, [id]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Back button />
			<Preview title={`Category ${name?.charAt(0).toUpperCase()}${name?.slice(1)}`} grid>
				{loadingMovies ? (
					<Loader />
				) : (
					<>
						{movies.map(({ adult, id, overview, title, poster_path, vote_average }) => (
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
						))}
					</>
				)}
			</Preview>
		</>
	);
};

export { Categories };
