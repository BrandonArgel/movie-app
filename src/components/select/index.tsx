import { SelectOption } from "utils/interfaces";
import styles from "./select.module.scss";

interface Props {
	title: string;
	options: SelectOption[];
	setValue: (value: string) => void;
	value: string;
	multiSelect?: boolean;
}

const Select = ({ title = "", options = [], setValue, value }: Props) => {
	return (
		<select
			title={title}
			className={styles.select}
			onChange={(e) => setValue(e.target.value)}
			value={value}
		>
			{options.map(({ name, iso }) => (
				<option key={name} value={iso} title={name}>
					<>
						{name} ({iso})
					</>
				</option>
			))}
		</select>
	);
};

export { Select };
