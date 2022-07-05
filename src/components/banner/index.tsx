import { MovieInterface } from "utils/Interface";
import { AdultContent, Back, List, Loader } from "components";
import styles from "./banner.module.scss";

import { IMG_BASE_URL } from "config";

const Banner = ({
	adult,
	backdrop,
	children,
	id,
	genres,
	loading,
	overview,
	title,
	voteAverage,
}: MovieInterface) => {
	const addToFavorites = (id: number) => {
		// TODO: add to favorites
		console.log(`Add to favorites the movie with the id '${id}'`);
	};

	return (
		<div className={styles.banner}>
			<Back />
			{loading ? (
				<Loader />
			) : (
				<picture>
					<source
						srcSet={`${IMG_BASE_URL}/original/${backdrop}`}
						media="(min-width: 1280px)"
						type="image/jpg"
					/>
					<source
						srcSet={`${IMG_BASE_URL}/w1280/${backdrop}`}
						media="(min-width: 768px)"
						type="image/jpg"
					/>
					<source
						srcSet={`${IMG_BASE_URL}/w500/${backdrop}`}
						media="(min-width: 320px)"
						type="image/jpg"
					/>
					<img
						className={styles.banner__img}
						src={`${IMG_BASE_URL}/w500/${backdrop}`}
						alt={title}
						width={500}
						height={281}
					/>
				</picture>
			)}
			<div className={styles.banner__info}>
				<div className={styles.banner__content}>
					<h1 className={styles.banner__title}>
						{title}
						<span>
							⭐{voteAverage}
							{adult && <AdultContent />}
						</span>
					</h1>
					<p className={styles.banner__overview}>{overview}</p>
					<div className={styles.banner__more}>
						<List items={genres} />
						<button
							className={`${styles.banner__more_favorites} button`}
							onClick={() => addToFavorites(id as number)}
							title="Add to favorites"
						>
							Añadir a favoritos ❤
						</button>
					</div>
					{children}
				</div>
			</div>
		</div>
	);
};

export { Banner };
