import { Link } from "react-router-dom";
import { Loader } from "components/loader";
import styles from "./list.module.scss";

interface ListProps {
	items: any[] | undefined;
	loading: boolean;
}

const List = ({ items, loading }: ListProps) => {
	return (
		<ul className={styles.list}>
			{loading ? (
				<Loader />
			) : (
				items &&
				items.map(({ id, name }) => (
					<li key={id} className={styles.list__item}>
						<Link to={`/category/${id}/${name.toLowerCase()}`} title={name}>
							{name}
						</Link>
					</li>
				))
			)}
		</ul>
	);
};

export { List };
