import styles from "./footer.module.scss";

import { Social } from "config";

const Footer = () => {
	return (
		<footer className={styles.footer}>
			<div className={styles.footer__rights}>
				<p>@BrandArgel • All rights reserved ©{new Date().getFullYear()}.</p>
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
