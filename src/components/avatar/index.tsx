import { AvatarIcon } from "assets/icons/icons";
import styles from "./avatar.module.scss";
const BASE_GRAVATAR_URL = "https://secure.gravatar.com/avatar/";
interface AvatarProps {
	src: string;
	alt: string;
}

const Avatar = ({ src, alt }: AvatarProps) => {
	return (
		<>
			{src ? (
				<img src={`${BASE_GRAVATAR_URL}${src}`} alt={alt} className={styles.avatar} />
			) : (
				<div className={styles.avatar}>
					<AvatarIcon />
				</div>
			)}
		</>
	);
};

export { Avatar };
