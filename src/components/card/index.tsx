import { useNavigate } from "react-router-dom";
import { CardInterface } from "utils/CardInterface";
import clickHandler from "utils/clickHandler";
import styles from "./card.module.scss";

const Card = ({
	adult,
	img,
	backdrop,
	link,
	overview,
	title,
	voteAverage,
	slide,
}: CardInterface) => {
	const isTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent
	);
	const click = clickHandler(clickCallback, doubleClickCallback);
	const navigate = useNavigate();

	function clickCallback() {
		if (!isTouch) {
			navigate(link);
		}
	}

	function doubleClickCallback() {
		if (isTouch) {
			navigate(link);
		}
	}

	return (
		<div className={`${styles.card} ${slide ? styles.slide : ""}`}>
			<button
				className={styles.card__container}
				onClick={isTouch ? click : clickCallback}
				type="button"
			>
				<img
					src={
						img
							? `https://image.tmdb.org/t/p/w200/${img}`
							: `https://image.tmdb.org/t/p/w200/${backdrop}`
					}
					alt={title}
				/>
				<div className={styles.card__content}>
					{adult && <div className={styles.card__content_adult}>18</div>}
					<h3 className={styles.card__content_title}>{title}</h3>
					<p className={styles.card__content_overview}>{overview}</p>
					<p className={styles.card__content_info}>
						{isTouch ? "Double tap to see more" : "Click to see more"}
					</p>
					<p className={styles.card__content_vote}>⭐️ {voteAverage.toFixed(1)}</p>
				</div>
			</button>
		</div>
	);
};

export { Card };
