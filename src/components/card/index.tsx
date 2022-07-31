import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "context/userContext";
import {
	CardInterface,
	deleteRateMovie,
	lazyLoading,
	loaderImg,
	rateMovie,
	toggleFavorite,
	toggleWatchlater,
} from "utils";
import { AdultContent, Loader, Rating } from "components";
import { useClickHandler, useGetItemAPI } from "hooks";
import { BookMark, Heart, More, Remove, Star } from "assets/icons/icons";
import styles from "./card.module.scss";

const Card = ({
	adult,
	height = 300,
	img,
	link,
	id,
	overview,
	slide,
	title,
	voteAverage,
	width = 200,
	getFavorite,
	getWatchLater,
	getRated,
}: CardInterface) => {
	const { language, sessionId, texts, user } = useContext(UserContext);
	const [loadingAccountState, getAccountState] = useGetItemAPI({
		path: `/movie/${id}/account_states`,
		msg: texts.errors.errorGet,
	});
	const [rating, setRating] = useState(0);
	const [favorite, setFavorite] = useState(false);
	const [watchlater, setWatchlater] = useState(false);
	const imgRef = useRef<HTMLImageElement>(null);
	const isTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent
	);
	const navigate = useNavigate();

	const accountRequest = async () => {
		const { favorite, rated, watchlist } = await getAccountState({ session_id: sessionId });
		setFavorite(favorite);
		setWatchlater(watchlist);
		setRating(rated?.value * 10 || 0);
	};

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		if (favorite || watchlater || rating) return;
		accountRequest();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key !== "Enter" || e.code !== "Space") return;
		e.preventDefault();
		if (favorite || watchlater || rating) return;
		accountRequest();
	};

	const handleFavorite = async () => {
		if (!sessionId) return navigate("/login");
		const res = await toggleFavorite({
			id: id as number,
			favorite,
			add: texts.messages.addFavorite,
			remove: texts.messages.removeFavorite,
			err: texts.errors.errorFavorite,
			session_id: sessionId,
			account_id: user.id,
		});
		if (res.success) {
			setFavorite(!favorite);
			getFavorite?.(language, sessionId, user?.id);
		}
	};

	const handleWatchlater = async () => {
		if (!sessionId) return navigate("/login");
		const res = await toggleWatchlater({
			id: id as number,
			watchlater,
			add: texts.messages.addWatchlater,
			remove: texts.messages.removeWatchlater,
			err: texts.errors.errorPost,
			session_id: sessionId,
			account_id: user.id,
		});
		if (res.success) {
			setWatchlater(!watchlater);
			getWatchLater?.(language, sessionId, user?.id);
		}
	};

	const handleRating = async (n: number) => {
		const res = await rateMovie({
			movie_id: id as number,
			value: n / 10,
			session_id: sessionId,
			success: texts.messages.rateMovie,
			err: texts.errors.errorPost,
		});
		if (res.success) {
			setRating(n);
			getRated?.(language, sessionId, user?.id);
		}
	};

	const handleDeleteRating = async () => {
		const res = await deleteRateMovie({
			movie_id: id as number,
			session_id: sessionId,
			success: texts.messages.unrateMovie,
			err: texts.errors.errorPost,
		});
		if (res.success) {
			setRating(0);
			getRated?.(language, sessionId, user?.id);
		}
	};

	const clickCallback = () => {
		if (!isTouch) {
			navigate(`${link}`);
		}
	};

	const doubleClickCallback = () => {
		if (isTouch) {
			navigate(`${link}`);
		}
	};

	const click = useClickHandler(clickCallback, doubleClickCallback);

	useEffect(() => {
		if (imgRef.current) {
			lazyLoading(imgRef);
		}
	}, [img]);

	return (
		<div className={`${styles.card} ${slide ? styles.slide : ""}`}>
			<button
				className={`${styles.card__container} ${styles.skeleton} skeleton`}
				onClick={isTouch ? click : clickCallback}
				title={title}
				type="button"
			>
				<img
					className="hide"
					data-src={img}
					alt={title}
					ref={imgRef}
					src={loaderImg(width, height)}
					width={width}
					height={height}
				/>
				<div className={styles.card__content}>
					<h3 className={styles.card__content_title}>
						{sessionId && (
							<div
								className={styles.card__content_more}
								onClick={handleClick}
								onKeyDown={handleKeyDown}
								tabIndex={0}
								title={`${texts.card.more}: ${title}`}
							>
								<More />
								<ul className={styles.list}>
									{loadingAccountState ? (
										<Loader />
									) : (
										<>
											<li
												tabIndex={0}
												onClick={handleFavorite}
												className={favorite ? styles.active : ""}
											>
												<Heart /> {texts.card.favorite}
											</li>
											<li
												tabIndex={0}
												onClick={handleWatchlater}
												className={watchlater ? styles.active : ""}
											>
												<BookMark /> {texts.card.watchLater}
											</li>
											<li>
												<Rating
													initialValue={rating}
													onClick={handleRating}
													ratingValue={rating}
													transition
													allowHalfIcon
													size={23}
												/>
											</li>
											<li tabIndex={0} onClick={handleDeleteRating} className={styles.active}>
												<Remove />
											</li>
										</>
									)}
								</ul>
							</div>
						)}

						{title}
					</h3>
					<p className={styles.card__content_overview}>{overview}</p>
					<p className={styles.card__content_info}>
						{isTouch ? texts.card.dbclick : texts.card.click}
					</p>
					<p className={styles.card__content_vote}>
						<Star /> {voteAverage && voteAverage!.toFixed(1)}
					</p>
					{adult && <AdultContent />}
				</div>
			</button>
		</div>
	);
};

export { Card };
