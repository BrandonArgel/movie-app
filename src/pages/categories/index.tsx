import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Back, Card, Loader, Preview } from "components";
import { useGetItemsAPI, useInfiniteScroll } from "hooks";

const Categories = () => {
	// TODO: Implement pagination
	const { id, name } = useParams();
	const [movies, loadingMovies, getMovies, getMoreMovies, hasMore] = useGetItemsAPI({
		initialValue: [],
		destruct: "results",
	});
	const lastMovieElementRef = useInfiniteScroll(
		() => getMoreMovies("/discover/movie", { with_genres: id }),
		loadingMovies,
		hasMore
	);

	useEffect(() => {
		getMovies("/discover/movie", { with_genres: id });
	}, [id]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Back button />
			<Preview title={`Category ${name?.charAt(0).toUpperCase()}${name?.slice(1)}`} grid>
				{movies.length > 0 ? (
					movies.map(({ adult, id, overview, title, poster_path, vote_average }, i) => (
						<div key={id} ref={i === movies.length - 1 ? lastMovieElementRef : null}>
							<Card
								id={id}
								adult={adult}
								title={title}
								overview={overview}
								link={`/movie/${id}`}
								voteAverage={vote_average}
								img={poster_path}
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

export { Categories };
