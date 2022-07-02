import * as React from "react";
import { Outlet } from "react-router-dom";
import styles from "./index.module.scss";

const Layout = () => {
	return (
		<>
			<main>
				<Outlet />
			</main>
		</>
	);
};

export { Layout };
