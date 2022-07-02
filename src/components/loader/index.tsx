import Spinner from "assets/icons/spinner";

import styles from "./loader.module.scss";

const Loader = () => {
	return (
		<div className={styles.loader}>
			<Spinner />
		</div>
	);
};

export { Loader };
