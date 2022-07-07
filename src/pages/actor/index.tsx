import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Back, Loader, Preview, Slide, Slideshow } from "components";
import { useGetItemAPI, useGetItemsAPI } from "hooks/useApi";
import lazyLoading from "utils/lazyLoading";
import styles from "./actor.module.scss";

import { LOADER_IMG } from "utils/loaderImg";
import { IMG_BASE_URL } from "config";

const Actor = () => {
	// TODO: Implement pagination
	const imgRef = useRef<HTMLImageElement>(null);
	const { id } = useParams();
	const [actor, loading, getActor] = useGetItemAPI({}, { id });
	const [movies, loadingMovies, getMovies] = useGetItemsAPI([], { id });
	const { biography, name, birthday, deathday, place_of_birth, popularity, profile_path } =
		actor || {};

	useEffect(() => {
		getActor(`/person/${id}`);
		getMovies(`/person/${id}/movie_credits`, "cast");
	}, [id]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (imgRef.current) {
			lazyLoading(imgRef, true);
		}
	}, [loading]);

	return (
		<>
			<Back button />
			<Preview>
				<div className={styles.actor}>
					{loading ? (
						<div className="skeleton">
							<img
								className={`${styles.actor__img} hide`}
								src={LOADER_IMG(500, 201)}
								alt={name}
								width={500}
								height={281}
							/>
						</div>
					) : (
						<div className="skeleton">
							<img
								className={`${styles.actor__img} hide`}
								src={`${IMG_BASE_URL}/w500/${profile_path}`}
								alt={name}
								ref={imgRef}
								width={500}
								height={281}
							/>
						</div>
					)}

					{loading ? (
						<Loader />
					) : (
						<>
							<h1 className={styles.actor__title}>
								{name} ({birthday} {deathday ? " to " + deathday : ""})
							</h1>
							<h2 className={styles.actor__subtitle}>Biography</h2>
							<p className={styles.actor__biography}>
								{biography} {place_of_birth}
							</p>
							<p className={styles.actor__popularity}>⭐{popularity}</p>
						</>
					)}
				</div>
			</Preview>
			<div className={styles.movies}>
				<Preview title={`${name}'s Movies`}>
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
								img={poster_path}
								slide={true}
							/>
						))}
					</Slideshow>
				</Preview>
			</div>
		</>
	);
};

export { Actor };
