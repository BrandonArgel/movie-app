import Spinner from "assets/icons/spinner";
import styles from "./loader.module.scss";
import Logo from "assets/images/logo.png";

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

const FixedLoader = () => {
	return (
		<div className={styles.fixed}>
			<img src={Logo} alt="Logo" />
		</div>
	);
};

export { FixedLoader, Loader };
