import { useNavigate } from "react-router-dom";
import { useContext, useId, useEffect, useRef, useState } from "react";
import { UserContext } from "context/userContext";
import { CardInterface, lazyLoading, loaderImg } from "utils";
import { AdultContent, Popup } from "components";
import { useClickHandler, useGetItemAPI } from "hooks";
import { More, Star } from "assets/icons/icons";
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
	const cardId = useId();
	const body = document.querySelector("body");
	const {
		handleFavorite,
		handleWatchlater,
		handleRating,
		handleDeleteRating,
		language,
		sessionId,
		texts,
		user,
		popup,
		setPopup,
	} = useContext(UserContext);
	const [loadingAccountState, getAccountState] = useGetItemAPI({
		path: `/movie/${id}/account_states`,
		msg: texts.errors.errorGet,
	});
	const [rating, setRating] = useState(0);
	const [favorite, setFavorite] = useState(false);
	const [watchlater, setWatchlater] = useState(false);
	const imgRef = useRef<HTMLImageElement>(null);
	const more = useRef<HTMLDivElement>(null);
	const [buttonRect, setButtonReact] = useState({
		top: 0,
		left: 0,
		width: 0,
		height: 0,
	});
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
		if (popup === cardId) return setPopup("");
		accountRequest();
		setPopup(cardId);
		const rect = more.current!.getBoundingClientRect();
		setButtonReact(rect);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (popup === cardId) return setPopup("");
		if (e.key === "Enter" || e.key === " ") {
			e.stopPropagation();
			e.preventDefault();
			accountRequest();
			setPopup(cardId);
			const rect = more.current!.getBoundingClientRect();
			setButtonReact(rect);
		}
	};

	const toggleFavorite = async () => {
		const res = await handleFavorite({
			movie_id: id as number,
			favorite,
		});
		if (res.success) {
			setFavorite(!favorite);
			getFavorite?.(language, sessionId, user?.id);
		}
	};

	const toggleWatchlater = async () => {
		if (!sessionId) return navigate("/login");
		const res = await handleWatchlater({
			media_id: id as number,
			watchlater,
		});
		if (res.success) {
			setWatchlater(!watchlater);
			getWatchLater?.(language, sessionId, user?.id);
		}
	};

	const onRating = async (rate: number) => {
		const res = await handleRating({
			movie_id: id as number,
			value: rate,
		});
		if (res.success) {
			setRating(rate);
			getRated?.(language, sessionId, user?.id);
		}
	};

	const onDeleteRating = async () => {
		const res = await handleDeleteRating({
			movie_id: id as number,
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

	const handleClosePopup = () => {
		setPopup("");
	};

	useEffect(() => {
		if (!popup) return;
		body!.addEventListener("click", handleClosePopup);
		return () => body!.removeEventListener("click", handleClosePopup);
	}, [popup]); // eslint-disable-line

	return (
		<div className={`${styles.card} ${slide ? styles.slide : ""}`}>
			<button
				className={`${styles.card__container} ${popup === cardId ? styles.active : ""} ${
					styles.skeleton
				} skeleton`}
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
							<>
								<div
									className={styles.card__content_more}
									onClick={handleClick}
									onKeyDown={handleKeyDown}
									tabIndex={0}
									title={`${texts.card.more}: ${title}`}
									ref={more}
								>
									<More />
								</div>
								{popup === cardId && (
									<Popup
										loading={loadingAccountState}
										favorite={favorite}
										watchlater={watchlater}
										rating={rating}
										toggleFavorite={toggleFavorite}
										toggleWatchlater={toggleWatchlater}
										onRating={onRating}
										onDeleteRating={onDeleteRating}
										buttonRect={buttonRect}
									/>
								)}
							</>
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
