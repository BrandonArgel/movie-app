import * as React from "react";
import { Card } from "components";
import { ArrowLeft, ArrowRight } from "assets/icons/arrows";
import { CardInterface } from "utils";
import styles from "./slideshow.module.scss";

type timeout = {
	id: number;
	slides: Element[];
};

interface SlideshowProps {
	children: React.ReactNode;
	loading: boolean;
	speed?: number;
	number?: number;
	slideAll?: boolean;
}

/**
 *
 * @param {React.ReactNode} children The elements to be displayed (use the slide component)
 * @param {boolean} loading - Whether the slideshow is loading or not (If using with a API)
 * @param {number} speed - The speed of the transition in milliseconds
 * @param {number} number - The slides to be moved at once
 * @param {boolean} slideAll - Whether the slides should be moved all at once or not
 * @returns {JSX.Element}
 */

const Slideshow: React.FC<SlideshowProps> = ({
	children,
	loading,
	speed = 200,
	number = 1,
	slideAll = false,
}) => {
	const slideshow = React.useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>;
	const timeout = React.useRef<timeout>({
		id: 0,
		slides: [],
	});
	const [numberOfSlides, setNumberOfSlides] = React.useState(slideshow.current?.children.length);
	const [visibleSlides, setVisibleSlides] = React.useState(0);

	const updateVisibleSlides = React.useCallback(() => {
		setNumberOfSlides(slideshow.current?.children.length);
		const slides = Array.from(slideshow.current.children);
		slides.forEach((slide, i) => {
			const child = slide.children[0] as HTMLElement;
			i + 1 <= visibleSlides
				? child.removeAttribute("tabindex")
				: child.setAttribute("tabindex", "-1");
			i + 1 <= visibleSlides
				? slide.removeAttribute("aria-hidden")
				: slide.setAttribute("aria-hidden", "true");
		});
	}, []); // eslint-disable-line

	const handleResize = React.useCallback(() => {
		const vw = window.innerWidth;
		const visibles = vw < 480 ? 2 : vw < 640 ? 3 : vw < 800 ? 4 : vw < 960 ? 5 : 6;
		setVisibleSlides(visibles);
		updateVisibleSlides();
	}, []); // eslint-disable-line

	const next = () => {
		if (timeout.current) {
			clearTimeout(timeout.current.id);
			slideshow.current.style.transition = "none";
			slideshow.current.style.transform = `translateX(0)`;
			slideshow.current.append(...timeout.current.slides);
		}

		const totalSlides = slideshow.current?.children.length;
		if (totalSlides > 0) {
			const slidesToSlide = slideAll ? visibleSlides : number;
			const slides = Array.from(slideshow.current.children).slice(0, slidesToSlide);
			const widthSlide = slides[0].clientWidth;

			slideshow.current.style.transition = `${speed}ms ease-out all`;
			slideshow.current.style.transform = `translateX(-${widthSlide * slidesToSlide}px)`;

			timeout.current.id = window.setTimeout(() => {
				slideshow.current.style.transition = "none";
				slideshow.current.style.transform = `translateX(0)`;
				slideshow.current.append(...slides);
			}, speed);
			timeout.current.slides = slides;
		}
		updateVisibleSlides();
	};

	const prev = () => {
		const totalSlides = slideshow.current?.children.length;
		if (totalSlides > 0) {
			const slidesToSlide = slideAll ? visibleSlides : number;
			const slides = Array.from(slideshow.current.children).slice(
				totalSlides - slidesToSlide,
				totalSlides
			);
			const widthSlide = slides[0].clientWidth;
			slideshow.current.style.transition = "none";
			slides.forEach((slide) => {
				slideshow.current.insertBefore(slide, slideshow.current.firstChild);
			});
			slideshow.current.style.transform = `translateX(-${widthSlide * slidesToSlide}px)`;

			setTimeout(() => {
				slideshow.current.style.transition = `${speed}ms ease-out all`;
				slideshow.current.style.transform = `translateX(0)`;
			}, 0);
		}
		updateVisibleSlides();
	};

	React.useEffect(() => {
		window.addEventListener("resize", handleResize);
		handleResize();

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [children]); // eslint-disable-line

	return (
		<div className={styles.slideshow}>
			<div className={styles.slideshow__container} ref={slideshow}>
				{loading
					? Array.from({ length: visibleSlides }).map((_, i) => <Card key={i} slide></Card>)
					: children}
			</div>
			<div className={styles.slideshow__controls}>
				<button
					type="button"
					className={styles.slideshow__controls_prev}
					onClick={prev}
					aria-label="Anterior película"
					disabled={numberOfSlides < visibleSlides || loading}
				>
					<ArrowLeft />
				</button>
				<button
					type="button"
					className={styles.slideshow__controls_next}
					onClick={next}
					aria-label="Siguiente película"
					disabled={numberOfSlides < visibleSlides || loading}
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
