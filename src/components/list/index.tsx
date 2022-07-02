import { Link } from "react-router-dom";
import styles from "./list.module.scss";

interface ListProps {
	items: any[];
}

const List = ({ items }: ListProps) => {
	return (
		<ul className={styles.list}>
			{items.map(({ id, name }) => (
				<li key={id} className={styles.list__item}>
					<Link to={`category/${id}`}>{name}</Link>
				</li>
			))}
		</ul>
	);
};

export { List };
