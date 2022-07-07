import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CardInterface } from "utils/Interface";
import { AdultContent } from "components";
import clickHandler from "utils/clickHandler";
import lazyLoading from "utils/lazyLoading";
import styles from "./card.module.scss";

const Card = ({
	adult,
	img,
	link,
	overview,
	skeleton,
	title,
	voteAverage,
	slide,
}: CardInterface) => {
	const imgRef = useRef<HTMLImageElement>(null);
	const isTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent
	);
	const click = clickHandler(clickCallback, doubleClickCallback);
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

	if (skeleton) {
		return (
			<div className={`${styles.card} ${slide ? styles.slide : ""}`}>
				<div className={`${styles.card__container} ${styles.skeleton} skeleton`}>
					<img src="" alt="" width={200} height={300} />
				</div>
			</div>
		);
	}

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
					width={200}
					height={300}
				/>
				<div className={styles.card__content}>
					<h3 className={styles.card__content_title}>{title}</h3>
					<p className={styles.card__content_overview}>{overview}</p>
					<p className={styles.card__content_info}>
						{isTouch ? "Double tap to see more" : "Click to see more"}
					</p>
					<p className={styles.card__content_vote}>⭐️ {voteAverage!.toFixed(1)}</p>
					{adult && <AdultContent />}
				</div>
			</button>
		</div>
	);
};

export { Card };
