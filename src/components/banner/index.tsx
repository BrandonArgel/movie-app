import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "context";
import { AdultContent, Avatar, Back, ButtonTheme, List, Loader, Rating, Select } from "components";
import { useGetItemAPI } from "hooks";
import { deleteRateMovie, MovieInterface } from "utils";
import { lazyLoading, loaderImg, rateMovie, toggleFavorite, toggleWatchlater } from "utils";
import { BookMark, Heart, Remove, Star } from "assets/icons/icons";
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
	sessionId,
	title,
	voteAverage,
}: MovieInterface) => {
	const navigate = useNavigate();
	const { language, setLanguage, texts, user } = useContext(UserContext);
	const [loadingAccountState, getAccountState] = useGetItemAPI({
		path: `/movie/${id}/account_states`,
		msg: texts.errors.errorGet,
	});
	const [rating, setRating] = useState(0);
	const [favorite, setFavorite] = useState(false);
	const [watchlater, setWatchlater] = useState(false);
	const imgRef = useRef<HTMLImageElement>(null);

	const handleFavorite = async () => {
		if (!sessionId) return navigate("/login");
		const res = await toggleFavorite({
			id,
			favorite,
			add: texts.messages.addFavorite,
			remove: texts.messages.removeFavorite,
			err: texts.errors.errorFavorite,
			session_id: sessionId,
			account_id: user.id,
		});
		if (res.success) return setFavorite(!favorite);
	};

	const handleWatchlater = async () => {
		if (!sessionId) return navigate("/login");
		const res = await toggleWatchlater({
			id,
			watchlater,
			add: texts.messages.addWatchlater,
			remove: texts.messages.removeWatchlater,
			err: texts.errors.errorPost,
			session_id: sessionId,
			account_id: user.id,
		});
		if (res.success) return setWatchlater(!watchlater);
	};

	const handleRating = async (n: number) => {
		const res = await rateMovie({
			movie_id: id,
			value: n / 10,
			session_id: sessionId,
			success: texts.messages.rateMovie,
			err: texts.errors.errorPost,
		});
		if (res.success) {
			setRating(n);
		}
	};

	const handleDeleteRating = async () => {
		const res = await deleteRateMovie({
			movie_id: id,
			session_id: sessionId,
			success: texts.messages.unrateMovie,
			err: texts.errors.errorPost,
		});
		if (res.success) {
			setRating(0);
		}
	};

	const initialAccountRequest = async () => {
		const { favorite, rated, watchlist } = await getAccountState({ session_id: sessionId });
		setFavorite(favorite);
		setWatchlater(watchlist);
		setRating(rated?.value * 10 || 0);
	};

	useEffect(() => {
		if (!sessionId) return;
		initialAccountRequest();
	}, [sessionId, language]); // eslint-disable-line react-hooks/exhaustive-deps

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
					<div className={styles.banner__controls}>
						<ButtonTheme />
						<div className={styles.banner__controls_select}>
							<Select
								title="Change languaje"
								options={texts.header.languages}
								setValue={setLanguage}
								value={language}
							/>
							{sessionId && (
								<Link to="/account">
									<Avatar src={user?.avatar} alt={user?.username} />
								</Link>
							)}
						</div>
					</div>
					<h1 className={styles.banner__title}>
						{title}
						<span>
							<Star />
							{voteAverage}
							{adult && <AdultContent />}
						</span>
					</h1>
					<p className={styles.banner__overview}>{overview}</p>
					<div className={styles.banner__genres}>
						<List items={genres} loading={loading} />
						<div>
							{loadingAccountState ? (
								<Loader />
							) : (
								sessionId && (
									<div className={styles.banner__more}>
										<div className={styles.banner__more_remove} onClick={handleDeleteRating}>
											<Remove />
										</div>
										<Rating
											initialValue={rating}
											onClick={handleRating}
											ratingValue={rating}
											transition
											allowHalfIcon
										/>
										<div className={styles.banner__more_buttons}>
											<button
												className={`${styles.button} ${favorite ? styles.active : ""}`}
												onClick={handleFavorite}
												title={favorite ? texts.banner.removeFav : texts.banner.addFav}
											>
												<Heart />
											</button>
											<button
												className={`${styles.button} ${watchlater ? styles.active : ""}`}
												onClick={handleWatchlater}
												title={
													watchlater ? texts.banner.removeWatchlater : texts.banner.addWatchlater
												}
											>
												<BookMark />
											</button>
										</div>
									</div>
								)
							)}
						</div>
					</div>
					{children}
				</div>
			</div>
		</div>
	);
};

export { Banner };
