import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import { UserContext } from "context/userContext";
import { CardActorInterface, lazyLoading, loaderImg } from "utils";
import { AdultContent } from "components";
import { useClickHandler } from "hooks";
import styles from "./card.module.scss";

const CardActor = ({
	adult,
	height = 300,
	img,
	link,
	character,
	name,
	slide,
	popularity,
	width = 200,
}: CardActorInterface) => {
	const { texts } = useContext(UserContext);
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
	}, [img]);

	return (
		<div className={`${styles.card} ${slide ? styles.slide : ""}`}>
			<button
				className={`${styles.card__container} ${styles.skeleton} skeleton`}
				onClick={isTouch ? click : clickCallback}
				type="button"
				title={name}
			>
				<img
					className="hide"
					data-src={img}
					alt={name}
					ref={imgRef}
					src={loaderImg(width, height)}
					width={width}
					height={height}
				/>
				<div className={styles.card__content}>
					<h3 className={styles.card__content_title}>{name}</h3>
					<p className={styles.card__content_overview}>{character}</p>
					<p className={styles.card__content_info}>
						{isTouch ? texts.card.dbclick : texts.card.click}
					</p>
					<p className={styles.card__content_vote}>⭐️ {popularity && popularity!.toFixed(1)}</p>
					{adult && <AdultContent />}
				</div>
			</button>
		</div>
	);
};

export { CardActor };
