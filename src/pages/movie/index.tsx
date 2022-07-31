import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetItemAPI, useGetItemsAPI } from "hooks";
import { Banner, Loader, Preview, Slide, SlideActor, Slideshow } from "components";
import styles from "./movie.module.scss";
import { UserContext } from "context";

const Movie = () => {
	const { id } = useParams();
	const { language, sessionId, texts } = useContext(UserContext);
	const [movie, setMovie] = useState<any>();
	const [loadingMovie, getMovie] = useGetItemAPI({
		path: `/movie/${id}`,
		msg: texts.errors.errorGet,
	});
	const [videos, loadingVideos, getVideos] = useGetItemsAPI({
		initialValue: [],
		destruct: "results",
		msg: texts.errors.errorGet,
	});
	const [cast, loadingCast, getCast] = useGetItemsAPI({
		initialValue: [],
		destruct: "cast",
		msg: texts.errors.errorGet,
	});
	const [related, loadingRelated, getRelated] = useGetItemsAPI({
		initialValue: [],
		destruct: "results",
		msg: texts.errors.errorGet,
	});
	const trailer = videos?.find((video) => video.type === "Trailer");

	const initialRequest = async (lang: string) => {
		const data = await getMovie({ language: lang, include_image_language: lang });
		setMovie(data);
		getVideos(`/movie/${id}/videos`, { language: lang });
		getCast(`/movie/${id}/credits`, { language: lang });
		getRelated(`/movie/${id}/similar`, { language: lang });
	};

	useEffect(() => {
		initialRequest(language);
	}, [id, language]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Banner
				id={parseInt(id as string, 10)}
				adult={movie && movie.adult}
				backdrop={movie && movie.backdrop_path}
				loading={loadingMovie}
				genres={movie && movie.genres}
				overview={movie && movie.overview}
				sessionId={sessionId}
				title={movie && movie.title}
				voteAverage={movie && movie.vote_average}
			>
				<Preview title={texts.movie.cast}>
					<Slideshow loading={loadingCast} speed={1000} slideAll>
						{cast
							.filter((actor) => actor.profile_path)
							.map(({ adult, id, character, name, popularity, profile_path }) => (
								<SlideActor
									id={id}
									adult={adult}
									key={id}
									name={name}
									character={character}
									link={`/actor/${id}`}
									popularity={popularity}
									img={profile_path}
								/>
							))}
					</Slideshow>
				</Preview>
				{trailer && (
					<Preview title={texts.movie.trailer}>
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
					<Preview title={texts.movie.related}>
						<Slideshow loading={loadingRelated} speed={1000} slideAll>
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
									slide
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
