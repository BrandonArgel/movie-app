// Repo of the creator of this component: https://github.com/awran5/react-simple-star-rating/blob/main/src/Components/Rating.tsx
import React, { useCallback, useContext, Fragment, useMemo, useReducer } from "react";
import { UserContext } from "context";
import { StarIcon } from "./starIcon";
import styles from "./rating.module.scss";

/**
 * check for touch devices
 *
 * @returns `boolean`
 */
const isTouchDevice = () => "ontouchstart" in window || navigator.maxTouchPoints > 0;

function calculateCurrentPosition(totalIcons: number, positionX: number, width: number) {
	const iconWidth = width / totalIcons;
	let currentValue = totalIcons;

	for (let i = 0; i < totalIcons; i += 1) {
		// if position less then quarter icon
		if (positionX <= iconWidth * i + iconWidth / 4) {
			// if there is no value return 0
			if (i === 0 && positionX < iconWidth / 2) currentValue = 0;
			else currentValue = i;
			break;
		}
	}

	return currentValue;
}

type State = {
	defaultValue: number | null;
	hoverValue: number | null;
};

type Action =
	| { type: "PointerMove"; payload: number | null }
	| { type: "PointerLeave" }
	| { type: "MouseClick"; payload: number }
	| { type: "KeyDown"; payload: number };

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "PointerMove":
			return {
				...state,
				hoverValue: action.payload,
			};

		case "PointerLeave":
			return {
				defaultValue: state.defaultValue,
				hoverValue: null,
			};

		case "MouseClick":
			return {
				...state,
				defaultValue: action.payload,
			};

		case "KeyDown":
			return {
				...state,
				defaultValue: action.payload,
			};

		default:
			return state;
	}
}

export interface Props {
	onClick?: (value: number) => void;
	initialValue?: number;
	ratingValue: number;
	iconsCount?: number;
	size?: number;
	readonly?: boolean;
	fillColor?: string;
	fillColorArray?: string[];
	emptyColor?: string;
	fullIcon?: React.ReactElement | null;
	emptyIcon?: React.ReactElement | null;
	customIcons?: {
		icon: React.ReactElement;
	}[];
	allowHalfIcon?: boolean;
	allowHover?: boolean;
	transition?: boolean;
	showTooltip?: boolean;
	tooltipDefaultText?: string;
	tooltipArray?: string[];
}

const Rating = ({
	onClick,
	initialValue = 0,
	ratingValue = 0,
	iconsCount = 5,
	size = 30,
	readonly = false,
	fillColor = "#e74596",
	fillColorArray = [],
	emptyColor,
	fullIcon = null,
	emptyIcon = null,
	customIcons = [],
	allowHalfIcon = false,
	allowHover = true,
	transition = false,
	showTooltip = false,
	tooltipDefaultText = "Your Rate",
	tooltipArray = [],
}: Props) => {
	const { texts } = useContext(UserContext);
	const [{ defaultValue, hoverValue }, dispatch] = useReducer(reducer, {
		defaultValue: ratingValue,
		hoverValue: null,
	});

	// re-render when ratingValue changes
	React.useEffect(() => dispatch({ type: "MouseClick", payload: ratingValue }), [ratingValue]);

	/**
	 * use pointer event rather than mouse event
	 *
	 * @param event
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent
	 * @returns `void`
	 */
	const onPointerMove = (event: React.PointerEvent<HTMLSpanElement>) => {
		const { clientX, currentTarget } = event;
		// get main span element position and width
		const { left, width } = currentTarget.children[0].getBoundingClientRect();
		const positionX = clientX - left;

		// Get current pointer position while moves over the icons
		const currentValue = calculateCurrentPosition(totalIcons, positionX, width);

		// set the value to state
		if (currentValue > 0 && hoverValue !== currentValue) {
			dispatch({ type: "PointerMove", payload: (currentValue * 100) / totalIcons });
		}
	};

	/**
	 * handle onEnter
	 * @param event
	 * @returns `void`
	 */
	const onPointerEnter = (event: React.PointerEvent<HTMLSpanElement>) => {
		// enable only on touch devices
		if (!isTouchDevice()) return;

		// call to get the value
		onPointerMove(event);
	};

	/**
	 * handle onClick
	 * @returns `void`
	 */
	const onRate = () => {
		if (hoverValue) {
			dispatch({ type: "MouseClick", payload: hoverValue });
			// update value on click
			if (onClick) onClick(hoverValue);
		} else {
			if (onClick) onClick(defaultValue as number);
		}
	};

	/**
	 * handle onLeave
	 * @returns `void`
	 */
	const onPointerLeave = () => {
		if (isTouchDevice()) onRate();

		dispatch({ type: "PointerLeave" });
	};

	// if there is a local rating value, convert it to precentage
	const localRating = useMemo(
		() => Math.round((initialValue / iconsCount) * 100),
		[initialValue, iconsCount]
	);

	/**
	 * convert rating value to percentage value
	 * @returns `hover value` | `rating value` | `local rating`
	 */
	const valuePercentage = useMemo(
		() => (allowHover && hoverValue && hoverValue) || (defaultValue && defaultValue) || localRating,
		[allowHover, hoverValue, defaultValue, localRating]
	);

	// handle total icons
	const totalIcons = useMemo(
		() => (allowHalfIcon ? iconsCount * 2 : iconsCount),
		[allowHalfIcon, iconsCount]
	);

	// convert value to index
	const valueIndex = useCallback(
		(value: number) => {
			let index = 1;
			if (value) {
				index = Math.round((value / 100) * totalIcons) + 1;
			}

			return Math.round(index - 1);
		},
		[totalIcons]
	);

	// convert value to render value
	const renderValue = useCallback(
		(value: number) => {
			const rvalue = valueIndex(value);

			return allowHalfIcon ? rvalue / 2 : rvalue;
		},
		[allowHalfIcon, valueIndex]
	);

	// handle tooltip values
	const handleTooltip = (value: number) =>
		tooltipArray.length > 0 ? tooltipArray[valueIndex(value)] : renderValue(value) || 0;

	// handle value with arrow keys
	const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
		const { key } = event;
		const value = defaultValue || 0;

		switch (key) {
			case "ArrowLeft":
				const newValLeft = value - (allowHalfIcon ? iconsCount * 2 : iconsCount);
				if (newValLeft <= 5) return dispatch({ type: "KeyDown", payload: 10 });
				dispatch({ type: "KeyDown", payload: newValLeft });
				break;
			case "ArrowRight":
				const newValRight = value + (allowHalfIcon ? iconsCount * 2 : iconsCount);

				if (newValRight >= 100) return dispatch({ type: "KeyDown", payload: 100 });
				dispatch({ type: "KeyDown", payload: newValRight });
				break;
			case "Enter":
				onRate();
				break;
			case "ArrowLeft" || "ArrowDown" || "Enter":
				event.preventDefault();
				break;
			default:
				break;
		}
	};

	return (
		<span className={styles.rating}>
			<span
				className={styles.rating__stars}
				style={{
					cursor: readonly ? "" : "pointer",
				}}
				onPointerMove={readonly ? undefined : onPointerMove}
				onPointerEnter={readonly ? undefined : onPointerEnter}
				onPointerLeave={readonly ? undefined : onPointerLeave}
				onClick={readonly ? undefined : onRate}
				onKeyDown={readonly ? undefined : handleKeyDown}
				tabIndex={0}
			>
				<span
					className={styles.rating__stars_empty}
					style={{
						color: emptyColor,
					}}
				>
					{[...Array(iconsCount)].map((_, index) => (
						<Fragment key={index}>
							{customIcons[index]?.icon || emptyIcon || <StarIcon key={index} size={size} />}
						</Fragment>
					))}
				</span>

				<span
					className={styles.rating__stars_filled}
					style={{
						color:
							(allowHover && hoverValue && fillColorArray[valueIndex(hoverValue)]) ||
							(defaultValue && fillColorArray[valueIndex(defaultValue)]) ||
							fillColor,
						transition: transition ? "width .2s ease, color .2s ease" : "",
						width: `${valuePercentage}%`,
					}}
					title={`${(hoverValue && renderValue(hoverValue)) || renderValue(localRating)} ${
						texts.rating
					} ${iconsCount}`}
				>
					{[...Array(iconsCount)].map((_, index) => (
						<Fragment key={index}>
							{customIcons[index]?.icon || fullIcon || <StarIcon size={size} />}
						</Fragment>
					))}
				</span>
			</span>

			{showTooltip && (
				<span className={styles.rating__tooltip}>
					{(hoverValue && handleTooltip(hoverValue)) ||
						(defaultValue && handleTooltip(defaultValue)) ||
						(localRating && handleTooltip(localRating)) ||
						tooltipDefaultText}
				</span>
			)}
		</span>
	);
};

export { Rating };
