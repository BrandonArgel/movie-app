import { Link } from "react-router-dom";
import styles from "./list.module.scss";

interface ListProps {
	items: any[] | undefined;
}

const List = ({ items }: ListProps) => {
	return (
		<ul className={styles.list}>
			{items && items.map(({ id, name }) => (
				<li key={id} className={styles.list__item}>
					<Link to={`/category/${id}/${name.toLowerCase()}`} title={name}>
						{name}
					</Link>
				</li>
			))}
		</ul>
	);
};

export { List };
