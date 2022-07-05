import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "assets/icons/arrows";
import styles from "./back.module.scss";

interface BackProps {
	button?: boolean;
}

const Back = ({ button }: BackProps) => {
	const navigate = useNavigate();
	const handleClick = () => {
		const stateLoad = window.history.state ? window.history.state.loadUrl : "";
		if (stateLoad) {
			navigate(stateLoad || "/");
		} else {
			window.history.back();
		}
	};

	return (
		<button
			className={`${button ? styles.button : styles.back} button`}
			onClick={handleClick}
			title="Back"
			type="button"
		>
			<ArrowLeft />
			&nbsp;{button && "Back"}
		</button>
	);
};

export { Back };
