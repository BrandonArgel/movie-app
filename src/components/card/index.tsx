import { useNavigate } from "react-router-dom";
import { CardInterface } from "utils/Interface";
import { AdultContent } from "components";
import clickHandler from "utils/clickHandler";
import styles from "./card.module.scss";

import { IMG_BASE_URL } from "config";

const Card = ({ adult, img, link, overview, title, voteAverage, slide }: CardInterface) => {
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

	return (
		<div className={`${styles.card} ${slide ? styles.slide : ""}`}>
			<button
				className={styles.card__container}
				onClick={isTouch ? click : clickCallback}
				type="button"
			>
				<img src={`${IMG_BASE_URL}/w200/${img}`} alt={title} loading={!slide ? "lazy" : "eager"} width={200} height={300} />
				<div className={styles.card__content}>
					<h3 className={styles.card__content_title}>{title}</h3>
					<p className={styles.card__content_overview}>{overview}</p>
					<p className={styles.card__content_info}>
						{isTouch ? "Double tap to see more" : "Click to see more"}
					</p>
					<p className={styles.card__content_vote}>⭐️ {voteAverage.toFixed(1)}</p>
					{adult && <AdultContent />}
				</div>
			</button>
		</div>
	);
};

export { Card };
