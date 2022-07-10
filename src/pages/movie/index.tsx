import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetItemAPI, useGetItemsAPI } from "hooks";
import { Banner, Loader, Preview, Slide, Slideshow } from "components";
import styles from "./movie.module.scss";

const Movie = () => {
	const { id } = useParams();
	const [movie, setMovie] = useState<any>();
	const [loadingMovie, getMovie] = useGetItemAPI({
		path: `/movie/${id}`,
	});
	const [videos, loadingVideos, getVideos] = useGetItemsAPI({
		initialValue: [],
		destruct: "results",
	});
	const [cast, loadingCast, getCast] = useGetItemsAPI({
		initialValue: [],
		destruct: "cast",
	});
	const [related, loadingRelated, getRelated] = useGetItemsAPI({
		initialValue: [],
		destruct: "results",
	});
	const trailer = videos?.find((video) => video.type === "Trailer");

	const initialRequest = async () => {
		const data = await getMovie();
		setMovie(data);
		getVideos(`/movie/${id}/videos`);
		getCast(`/movie/${id}/credits`);
		getRelated(`/movie/${id}/similar`);
	};

	useEffect(() => {
		initialRequest();
	}, [id]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Banner
				id={parseInt(id as string, 10)}
				adult={movie && movie.adult}
				backdrop={movie && movie.backdrop_path}
				loading={loadingMovie}
				genres={movie && movie.genres}
				overview={movie && movie.overview}
				title={movie && movie.title}
				voteAverage={movie && movie.vote_average}
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
				{related.length > 0 && (
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
									voteAverage={vote_average}
									img={poster_path}
									slide={true}
								/>
							))}
						</Slideshow>
					</Preview>
				)}
			</Banner>
		</>
	);
};

export { Movie };
