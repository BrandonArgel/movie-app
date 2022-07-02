import * as React from "react";
import { Outlet } from "react-router-dom";
import { Footer, Header } from "components";
import styles from "./layout.module.scss";

const Layout = () => {
	return (
		<>
			<Header />
			<main className={styles.main}>
				<Outlet />
			</main>
			<Footer />
		</>
	);
};

export { Layout };
