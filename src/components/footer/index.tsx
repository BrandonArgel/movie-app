import { useContext } from "react";
import { UserContext } from "context";
import styles from "./footer.module.scss";

import { Social } from "config";

const Footer = () => {
	const { texts } = useContext(UserContext);

	return (
		<footer className={styles.footer}>
			<div className={styles.footer__rights}>
				<p>{texts.footer.credits}</p>
				<p>
					@BrandArgel • {texts.footer.rights} ©{new Date().getFullYear()}.
				</p>
			</div>
			<div className={styles.footer__social}>
				{Social.map(({ link, icon, title }) => (
					<a href={link} key={link} target="_blank" rel="noopener noreferrer" title={title}>
						{icon}
					</a>
				))}
			</div>
		</footer>
	);
};

export { Footer };
