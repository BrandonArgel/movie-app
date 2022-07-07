import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetItemAPI, useGetItemsAPI } from "hooks/useApi";
import { Banner, Loader, Preview, Slide, Slideshow } from "components";
import styles from "./movie.module.scss";

const Movie = () => {
	const { id } = useParams();
	const [movie, loadingMovie, getMovie] = useGetItemAPI({}, { id });
	const [videos, loadingVideos, getVideos] = useGetItemsAPI([], { id });
	const [related, loadingRelated, getRelated] = useGetItemsAPI([], { id });
	const [cast, loadingCast, getCast] = useGetItemsAPI([], { id });
	const trailer = videos?.find((video) => video.type === "Trailer");

	useEffect(() => {
		getMovie(`/movie/${id}`);
		getVideos(`/movie/${id}/videos`, "results");
		getCast(`/movie/${id}/credits`, "cast");
		getRelated(`/movie/${id}/recommendations`, "results");
	}, [id]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Banner
				id={parseInt(id as string, 10)}
				adult={movie.adult}
				backdrop={movie.backdrop_path}
				loading={loadingMovie}
				genres={movie.genres}
				overview={movie.overview}
				title={movie.title}
				voteAverage={movie.vote_average}
			>
				<Preview title="Cast">
					<Slideshow loading={loadingCast} speed={300}>
						{cast
							.filter((actor) => actor.profile_path)
							.map(({ adult, id, character, name, popularity, profile_path }) => (
								<Slide
									id={id}
									adult={adult}
									key={id}
									title={name}
									overview={character}
									link={`/actor/${id}`}
									voteAverage={popularity}
									img={profile_path}
									slide={true}
								/>
							))}
					</Slideshow>
				</Preview>
				{trailer && (
					<Preview title={"Trailer"}>
						{loadingVideos ? (
							<Loader />
						) : (
							<div className={styles.trailer}>
								<iframe
									title={trailer.name}
									src={`https://www.youtube.com/embed/${trailer?.key}`}
									frameBorder={0}
									allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								/>
							</div>
						)}
					</Preview>
				)}
				<Preview title="Related">
					<Slideshow loading={loadingRelated} speed={300}>
						{related.map(({ adult, id, overview, title, poster_path, vote_average }) => (
							<Slide
								id={id}
								key={id}
								adult={adult}
								title={title}
								overview={overview}
								link={`/movie/${id}`}
								loading={loadingRelated}
								voteAverage={vote_average}
								img={poster_path}
								slide={true}
							/>
						))}
					</Slideshow>
				</Preview>
			</Banner>
		</>
	);
};

export { Movie };
