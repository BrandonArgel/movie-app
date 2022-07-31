import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "context";
import styles from "./preview.module.scss";

interface PreviewProps {
	children: React.ReactNode;
	title?: string;
	link?: string;
	grid?: boolean;
}

const Preview = ({ children, title, link, grid }: PreviewProps) => {
	const { texts } = useContext(UserContext);

	return (
		<>
			<div className={styles.preview}>
				{title && <h2 className={styles.preview__title}>{title}</h2>}
				{link && (
					<Link to={link} className={styles.preview__link} title={title}>
						{texts.preview.more}
					</Link>
				)}
			</div>
			<div className={grid ? styles.grid : ""}>{children}</div>
		</>
	);
};

export { Preview };
