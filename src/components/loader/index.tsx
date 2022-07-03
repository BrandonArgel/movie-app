import Spinner from "assets/icons/spinner";
import styles from "./loader.module.scss";

interface LoaderProps {
	text?: string;
}

const Loader = ({ text }: LoaderProps) => {
	return (
		<div className={styles.loader}>
			<Spinner />
			{text && <p className={styles.loader__text}>{text}</p>}
		</div>
	);
};

const FixedLoader = ({ text = "Loading..." }: LoaderProps) => {
	return (
		<div className={styles.fixed}>
			<Spinner />
			{text && <p className={styles.fixed__text}>{text}</p>}
		</div>
	);
};

export { FixedLoader, Loader };
