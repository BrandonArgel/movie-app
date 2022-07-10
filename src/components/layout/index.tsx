import * as React from "react";
import { Outlet } from "react-router-dom";
import { Footer, Header } from "components";
import styles from "./layout.module.scss";

const Layout = () => {
	return (
		<>
			<Header />
			<main className={styles.main} id="content">
				<Outlet />
			</main>
			<Footer />
		</>
	);
};

const SimpleLayout = () => {
	return (
		<main id="content">
			<Outlet />
		</main>
	);
};

export { Layout, SimpleLayout };
