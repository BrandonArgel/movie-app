import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "context";
import { ArrowLeft } from "assets/icons/arrows";
import styles from "./back.module.scss";
import { Button } from "components/button";

interface BackProps {
	button?: boolean;
}

const Back = ({ button }: BackProps) => {
	const navigate = useNavigate();
	const { texts } = useContext(UserContext);
	const handleClick = () => {
		const stateLoad = window.history.state ? window.history.state.loadUrl : "";
		if (stateLoad) {
			navigate(stateLoad || "/");
		} else {
			window.history.back();
		}
	};

	return (
		<Button
			className={`${button ? styles.button : styles.back}`}
			onClick={handleClick}
			type="button"
		>
			<ArrowLeft />
			&nbsp;{button && texts.back}
		</Button>
	);
};

export { Back };
