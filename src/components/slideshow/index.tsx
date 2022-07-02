import * as React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "assets/icons/arrows";
import clickHandler from "utils/clickHandler";
import styles from "./index.module.scss";

interface SlideshowProps {
	children: React.ReactNode;
	speed?: number;
}

const Slideshow: React.FC<SlideshowProps> = ({ children, speed = 500 }) => {
	const slideshow = React.useRef<HTMLInputElement>(
		null
	) as React.MutableRefObject<HTMLInputElement>;
	const viewportWidth = window.innerWidth;
	const visibleSlides =
		viewportWidth < 480
			? 2
			: viewportWidth < 640
			? 3
			: viewportWidth < 800
			? 4
			: viewportWidth < 960
			? 5
			: 6;

	const initialRender = React.useCallback(() => {
		const slides = Array.from(slideshow.current.children);
		console.log(visibleSlides, viewportWidth);
		slides.forEach((slide, i) => {
			const child = slide.children[0] as HTMLElement;
			const img = slide.children[0].children[0] as HTMLImageElement;
			i + 1 > visibleSlides && img.setAttribute("loading", "lazy");
			i + 1 <= visibleSlides
				? child.removeAttribute("tabindex")
				: child.setAttribute("tabindex", "-1");
			i + 1 <= visibleSlides
				? slide.removeAttribute("aria-hidden")
				: slide.setAttribute("aria-hidden", "true");
		});
	}, [viewportWidth, visibleSlides]);

	const updateVisibleSlides = React.useCallback(() => {
		const slides = Array.from(slideshow.current.children);
		slides.forEach((slide, i) => {
			// console.log({visibleSlides, i: i+1})
			const child = slide.children[0] as HTMLElement;
			i + 1 <= visibleSlides
				? child.removeAttribute("tabindex")
				: child.setAttribute("tabindex", "-1");
			i + 1 <= visibleSlides
				? slide.removeAttribute("aria-hidden")
				: slide.setAttribute("aria-hidden", "true");
		});
	}, [visibleSlides]);

	const next = () => {
		if (slideshow.current?.children.length > 0) {
			const firstElement = slideshow.current?.children[0] as HTMLElement;
			const widthSlide = firstElement.clientWidth;

			slideshow.current.style.transition = `${speed}ms ease-out all`;
			slideshow.current.style.transform = `translateX(-${widthSlide}px)`;

			setTimeout(() => {
				slideshow.current.style.transition = "none";
				slideshow.current.style.transform = `translateX(0)`;
				slideshow.current.appendChild(firstElement);

				updateVisibleSlides();
			}, speed);
		}
	};

	const prev = () => {
		if (slideshow.current.children.length > 0) {
			const index = slideshow.current.children.length - 1;
			const lastElement = slideshow.current.children[index];
			const widthSlide = lastElement.clientWidth;
			slideshow.current.style.transition = "none";
			slideshow.current.insertBefore(lastElement, slideshow.current.firstChild);
			slideshow.current.style.transform = `translateX(-${widthSlide}px)`;

			setTimeout(() => {
				slideshow.current.style.transition = `${speed}ms ease-out all`;
				slideshow.current.style.transform = `translateX(0)`;
			}, 0);
		}

		updateVisibleSlides();
	};

	React.useEffect(() => {
		initialRender();
	}, [initialRender]);

	return (
		<div className={styles.slideshow}>
			<div className={styles.slideshow__container} ref={slideshow}>
				{children}
			</div>
			<div className={styles.slideshow__controls}>
				<button
					type="button"
					className={styles.slideshow__controls_prev}
					onClick={prev}
					aria-label="Anterior película"
				>
					<ArrowLeft />
				</button>
				<button
					type="button"
					className={styles.slideshow__controls_next}
					onClick={next}
					aria-label="Siguiente película"
				>
					<ArrowRight />
				</button>
			</div>
		</div>
	);
};

interface SlideProps {
	adult: boolean;
	id: number;
	img: string;
	link: string;
	overview: string;
	title: string;
	voteAverage: number;
}

const Slide = ({ adult, img, link, overview, title, voteAverage }: SlideProps) => {
	// const isTouch = navigator.userAgentData.mobile
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
		<div className={styles.slide}>
			<button className={styles.slide__container} onClick={isTouch ? click : clickCallback}>
				<img src={img} alt={title} />
				<div className={styles.slide__content}>
					{adult && <div className={styles.slide__content_adult}>18</div>}
					<h3 className={styles.slide__content_title}>{title}</h3>
					<p className={styles.slide__content_overview}>{overview}</p>
					<p className={styles.slide__content_info}>
						{isTouch ? "Double tap to see more" : "Click to see more"}
					</p>
					<p className={styles.slide__content_vote}>⭐️ {voteAverage.toFixed(1)}</p>
				</div>
			</button>
		</div>
	);
};

export { Slideshow, Slide };
