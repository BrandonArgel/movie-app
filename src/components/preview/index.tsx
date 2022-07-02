import { Link } from "react-router-dom";
import styles from "./preview.module.scss";

interface PreviewProps {
	children: React.ReactNode;
	title: string;
	link?: string;
}

const Preview = ({ children, title, link }: PreviewProps) => {
	return (
		<>
			<div className={styles.preview}>
				<h2 className={styles.preview__title}>{title}</h2>
				{link && (
					<Link to={link} className={styles.preview__link}>
						See more
					</Link>
				)}
			</div>
			{children}
		</>
	);
};

export { Preview };
