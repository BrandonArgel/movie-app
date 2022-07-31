import AvatarImage from "assets/images/avatar.svg";
import styles from "./avatar.module.scss";
const BASE_GRAVATAR_URL = "https://secure.gravatar.com/avatar/";
interface AvatarProps {
	src: string;
	alt: string;
}

const Avatar = ({ src, alt }: AvatarProps) => {
	return (
		<img
			src={src ? `${BASE_GRAVATAR_URL}${src}` : AvatarImage}
			alt={alt}
			className={styles.avatar}
		/>
	);
};

export { Avatar };
