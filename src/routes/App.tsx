import * as React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FixedLoader, Layout, SimpleLayout } from "components";
const Landing = React.lazy(() => import("pages").then((module) => ({ default: module.Landing })));
const Categories = React.lazy(() =>
	import("pages").then((module) => ({ default: module.Categories }))
);

const App = () => {
	// TODO: create the a functional login page, and authenticate the user with the API
	// TODO: create context for the global user state

	return (
		<BrowserRouter>
			<React.Suspense fallback={<FixedLoader />}>
				<a className="skip-to-content" href="#content">
					Saltar al contenido
				</a>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<Landing />} />
					</Route>
					<Route path="/category" element={<Layout />}>
						<Route index element={<Navigate replace to="/" />} />
						<Route path="/category/:id/:name" element={<Categories />} />
					</Route>
					<Route path="*" element={<Navigate replace to="/" />} />
				</Routes>
			</React.Suspense>
		</BrowserRouter>
	);
};

export default App;
