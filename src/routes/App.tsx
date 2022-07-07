import * as React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FixedLoader, Layout, SimpleLayout } from "components";
import ScrollToTop from "utils/scrollTop";
const Categories = React.lazy(() =>
	import("pages").then((module) => ({ default: module.Categories }))
);
const Landing = React.lazy(() => import("pages").then((module) => ({ default: module.Landing })));
const Search = React.lazy(() => import("pages").then((module) => ({ default: module.Search })));
const Trends = React.lazy(() => import("pages").then((module) => ({ default: module.Trends })));
const Movie = React.lazy(() => import("pages").then((module) => ({ default: module.Movie })));
const Actor = React.lazy(() => import("pages").then((module) => ({ default: module.Actor })));

const App = () => {
	// TODO: create the a functional login page, and authenticate the user with the API
	// TODO: create context for the global user state

	React.useEffect(() => {
		window.history.pushState({ loadUrl: window.location.href }, "", window.location.href);
	}, []);

	return (
		<BrowserRouter>
			<ScrollToTop />
			<React.Suspense fallback={<FixedLoader />}>
				<a className="skip-to-content" href="#content">
					Saltar al contenido
				</a>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<Landing />} />
						<Route path="/category/:id/:name" element={<Categories />} />
						<Route path="/results" element={<Search />} />
						<Route path="/trending" element={<Trends />} />
						<Route path="/actor/:id" element={<Actor />} />
						<Route path="/login" element={<h1 style={{ textAlign: "center" }}>Developing...</h1>} />
						<Route
							path="/register"
							element={<h1 style={{ textAlign: "center" }}>Developing...</h1>}
						/>
					</Route>
					<Route path="/" element={<SimpleLayout />}>
						<Route path="/movie/:id" element={<Movie />} />
					</Route>
					<Route path="*" element={<Navigate replace to="/" />} />
				</Routes>
			</React.Suspense>
		</BrowserRouter>
	);
};

export default App;
