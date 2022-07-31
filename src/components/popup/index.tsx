import { createPortal } from "react-dom";
import { useContext } from "react";
import { UserContext } from "context/userContext";
import { Loader, Rating } from "components";
import { BookMark, Heart, Remove } from "assets/icons/icons";
import styles from "./popup.module.scss";

interface PopupInterface {
	loading: boolean;
	favorite: boolean;
	watchlater: boolean;
	rating: number;
	toggleFavorite: () => void;
	toggleWatchlater: () => void;
	onRating: (value: number) => void;
	onDeleteRating: () => void;
	buttonRect: {
		top: number;
		left: number;
		width: number;
		height: number;
	};
}

const Popup = ({
	loading,
	favorite,
	watchlater,
	rating,
	toggleFavorite,
	toggleWatchlater,
	onRating,
	onDeleteRating,
	buttonRect,
}: PopupInterface) => {
	const { texts } = useContext(UserContext);
	if (buttonRect.top === 0 && buttonRect.left === 0) return null;

	const calculatePosition = () => {
		if (!buttonRect) return;
		const { top, left, width, height } = buttonRect;
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const leftOffset = left + width + 100 > vw;
		const topOffset = top + height + 150 > vh;
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

		return {
			left: `${leftOffset ? vw - width - 70 : left + 10}px`,
			top: `${topOffset ? top + height + scrollTop - 200 : top + height + scrollTop + 10}px`,
		};
	};

	return createPortal(
		<ul className={styles.popup} style={calculatePosition()} onClick={(e) => e.stopPropagation()}>
			{loading ? (
				<Loader />
			) : (
				<>
					<li tabIndex={0} onClick={toggleFavorite} className={favorite ? styles.active : ""}>
						<Heart /> {texts.card.favorite}
					</li>
					<li tabIndex={0} onClick={toggleWatchlater} className={watchlater ? styles.active : ""}>
						<BookMark /> {texts.card.watchLater}
					</li>
					<li>
						<Rating
							initialValue={rating}
							onClick={onRating}
							ratingValue={rating}
							transition
							allowHalfIcon
							size={23}
						/>
					</li>
					<li tabIndex={0} onClick={onDeleteRating} className={styles.active}>
						<Remove />
					</li>
				</>
			)}
		</ul>,
		document.getElementById("popup") as HTMLElement
	);
};

export { Popup };
