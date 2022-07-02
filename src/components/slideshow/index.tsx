import * as React from "react";
import { Card, Loader } from "components";
import { ArrowLeft, ArrowRight } from "assets/icons/arrows";
import { CardInterface } from "utils/CardInterface";
import styles from "./slideshow.module.scss";

interface SlideshowProps {
	children: React.ReactNode;
	loading: boolean;
	speed?: number;
}

const Slideshow: React.FC<SlideshowProps> = ({ children, loading, speed = 500 }) => {
	const slideshow = React.useRef<HTMLInputElement>(
		null
	) as React.MutableRefObject<HTMLInputElement>;

	const updateVisibleSlides = React.useCallback(() => {
		const slides = Array.from(slideshow.current.children);
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

		slides.forEach((slide, i) => {
			const child = slide.children[0] as HTMLElement;
			i + 1 <= visibleSlides
				? child.removeAttribute("tabindex")
				: child.setAttribute("tabindex", "-1");
			i + 1 <= visibleSlides
				? slide.removeAttribute("aria-hidden")
				: slide.setAttribute("aria-hidden", "true");
		});
	}, []);

	const initialRender = React.useCallback(() => {
		const slides = Array.from(slideshow.current.children);
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

		// Update visible slides when window is resized
		window.addEventListener("resize", updateVisibleSlides);
	}, [updateVisibleSlides]);

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
	}, [children, initialRender]);

	return (
		<div className={styles.slideshow}>
			<div className={styles.slideshow__container} ref={slideshow}>
				{loading ? <Loader /> : children}
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

const Slide = (props: CardInterface) => {
	return <Card {...props} />;
};

export { Slideshow, Slide };
