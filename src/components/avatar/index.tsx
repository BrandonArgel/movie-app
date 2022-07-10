import styles from "./avatar.module.scss";
const BASE_GRAVATAR_URL = "https://secure.gravatar.com/avatar/";
interface AvatarProps {
	src: string;
	alt: string;
}

const Avatar = ({ src, alt }: AvatarProps) => {
	return (
		<img
			src={src ? `${BASE_GRAVATAR_URL}${src}` : BASE_GRAVATAR_URL}
			alt={alt}
			className={styles.avatar}
		/>
	);
};

export { Avatar };
