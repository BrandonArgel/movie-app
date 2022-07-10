import { useEffect, useRef } from "react";
import { MovieInterface } from "utils";
import { AdultContent, Back, Button, List } from "components";
import { lazyLoading, loaderImg } from "utils";
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
	const imgRef = useRef<HTMLImageElement>(null);
	const addToFavorites = (id: number) => {
		// TODO: add to favorites
		console.log(`Add to favorites the movie with the id '${id}'`);
	};

	useEffect(() => {
		if (imgRef.current) {
			lazyLoading(imgRef, true, true);
		}
	}, [loading]);

	return (
		<div className={styles.banner}>
			<Back />
			{loading ? (
				<div className="skeleton">
					<img
						className={`${styles.banner__img} hide`}
						width={500}
						height={281}
						alt="loader"
						src={loaderImg(500, 201)}
					/>
				</div>
			) : (
				<picture>
					<source
						srcSet={backdrop ? `${IMG_BASE_URL}/original/${backdrop}` : ""}
						media="(min-width: 1280px)"
						type="image/jpg"
					/>
					<source
						srcSet={backdrop ? `${IMG_BASE_URL}/w1280/${backdrop}` : ""}
						media="(max-width: 1279px)"
						type="image/jpg"
					/>
					<source
						srcSet={backdrop ? `${IMG_BASE_URL}/w500/${backdrop}` : ""}
						media="(max-width: 500px)"
						type="image/jpg"
					/>
					<div className="skeleton">
						<img
							className={`${styles.banner__img} hide`}
							src={backdrop ? `${IMG_BASE_URL}/original/${backdrop}` : ""}
							alt={title}
							width={500}
							height={281}
							ref={imgRef}
						/>
					</div>
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
						<List items={genres} loading={loading} />
						<Button
							className={`${styles.banner__more_favorites}`}
							onClick={() => addToFavorites(id as number)}
						>
							Añadir a favoritos ❤
						</Button>
					</div>
					{children}
				</div>
			</div>
		</div>
	);
};

export { Banner };
