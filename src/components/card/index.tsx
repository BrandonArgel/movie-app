import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CardInterface, lazyLoading, loaderImg } from "utils";
import { AdultContent } from "components";
import { useClickHandler } from "hooks";
import styles from "./card.module.scss";

const Card = ({
	adult,
	height = 300,
	img,
	link,
	overview,
	title,
	slide,
	voteAverage,
	width = 200,
}: CardInterface) => {
	const imgRef = useRef<HTMLImageElement>(null);
	const isTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent
	);
	const click = useClickHandler(clickCallback, doubleClickCallback);
	const navigate = useNavigate();

	function clickCallback() {
		if (!isTouch) {
			navigate(`${link}`);
		}
	}

	function doubleClickCallback() {
		if (isTouch) {
			navigate(`${link}`);
		}
	}

	useEffect(() => {
		if (imgRef.current) {
			lazyLoading(imgRef);
		}
	}, []);

	return (
		<div className={`${styles.card} ${slide ? styles.slide : ""}`}>
			<button
				className={`${styles.card__container} ${styles.skeleton} skeleton`}
				onClick={isTouch ? click : clickCallback}
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
					<h3 className={styles.card__content_title}>{title}</h3>
					<p className={styles.card__content_overview}>{overview}</p>
					<p className={styles.card__content_info}>
						{isTouch ? "Double tap to see more" : "Click to see more"}
					</p>
					<p className={styles.card__content_vote}>⭐️ {voteAverage && voteAverage!.toFixed(1)}</p>
					{adult && <AdultContent />}
				</div>
			</button>
		</div>
	);
};

export { Card };
