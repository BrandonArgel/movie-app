import { Link } from "react-router-dom";
import styles from "./preview.module.scss";

interface PreviewProps {
	children: React.ReactNode;
	title: string;
	link?: string;
	breadcrumb?: boolean;
}

const Preview = ({ children, title, link, breadcrumb }: PreviewProps) => {
	return (
		<>
			<div className={styles.preview}>
				<h2 className={breadcrumb ? styles.preview__title_breadcrumb : styles.preview__title}>
					{breadcrumb && <span><Link to={`/`}>Home</Link> / </span>}
					{title}
				</h2>
				{link && (
					<Link to={link} className={styles.preview__link} title={title}>
						See more
					</Link>
				)}
			</div>
			{children}
		</>
	);
};

export { Preview };
