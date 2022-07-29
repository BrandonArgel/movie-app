import { useParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "context/userContext";
import { Back, Loader, Preview, Slide, Slideshow } from "components";
import { useGetItemAPI, useGetItemsAPI } from "hooks";
import { lazyLoading, loaderImg } from "utils";
import styles from "./actor.module.scss";
import { IMG_BASE_URL } from "config";

const Actor = () => {
	const { texts, language } = useContext(UserContext);
	const imgRef = useRef<HTMLImageElement>(null);
	const { id } = useParams();
	const [actor, setActor] = useState<any>();
	const [loading, getActor] = useGetItemAPI({
		path: `/person/${id}`,
		msg: texts.errors.errorGet,
	});
	const [movies, loadingMovies, getMovies] = useGetItemsAPI({
		initialValue: [],
		destruct: "cast",
		msg: texts.errors.errorGet,
	});
	const { biography, name, birthday, deathday, place_of_birth, popularity, profile_path } =
		actor || {};

	const initialRequest = async (lang: string) => {
		const data = await getActor({ language: lang });
		setActor(data);
		getMovies(`/person/${id}/movie_credits`, { language: lang });
	};

	useEffect(() => {
		initialRequest(language);
	}, [id, language]); // eslint-disable-line react-hooks/exhaustive-deps

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
								src={loaderImg(500, 781)}
								alt={""}
								width={500}
								height={781}
							/>
						</div>
					) : (
						<div className="skeleton">
							<img
								className={`${styles.actor__img}`}
								src={`${IMG_BASE_URL}/w500/${profile_path}`}
								alt={name}
								ref={imgRef}
								width={500}
								height={781}
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
				<Preview
					title={
						language === "en-US" ? `${name}${texts.actor.title}` : `${texts.actor.title} ${name}`
					}
				>
					<Slideshow loading={loadingMovies} speed={1000} slideAll>
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
