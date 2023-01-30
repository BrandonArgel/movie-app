import * as React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FixedLoader, Layout, LayoutHeader, SimpleLayout } from "components";
import { ScrollToTop } from "utils";
import { UserProvider, ThemeProvider } from "context";
const Categories = React.lazy(() =>
	import("pages").then((module) => ({ default: module.Categories }))
);
const Actor = React.lazy(() => import("pages").then((module) => ({ default: module.Actor })));
const Account = React.lazy(() => import("pages").then((module) => ({ default: module.Account })));
const Approved = React.lazy(() => import("pages").then((module) => ({ default: module.Approved })));
const Favorites = React.lazy(() =>
	import("pages").then((module) => ({ default: module.Favorites }))
);
const Landing = React.lazy(() => import("pages").then((module) => ({ default: module.Landing })));
const Login = React.lazy(() => import("pages").then((module) => ({ default: module.Login })));
const Movie = React.lazy(() => import("pages").then((module) => ({ default: module.Movie })));
const Search = React.lazy(() => import("pages").then((module) => ({ default: module.Search })));
const Trends = React.lazy(() => import("pages").then((module) => ({ default: module.Trends })));

const App = () => {
	React.useEffect(() => {
		window.history.pushState({ loadUrl: window.location.href }, "", window.location.href);
	}, []);

	return (
		<ThemeProvider>
			<BrowserRouter>
				<ScrollToTop />
				<React.Suspense fallback={<FixedLoader />}>
					<a className="skip-to-content" href="#content">
						Saltar al contenido
					</a>
					<UserProvider>
						<Routes>
							<Route path="/" element={<Layout />}>
								<Route index element={<Landing />} />
								<Route path="/actor/:id" element={<Actor />} />
								<Route path="/login" element={<Login />} />
								<Route path="/approved" element={<Approved />} />
								<Route path="/account" element={<Account />} />
							</Route>
							<Route path="/" element={<LayoutHeader />}>
								<Route path="/category/:id/:name" element={<Categories />} />
								<Route path="/favorites" element={<Favorites />} />
								<Route path="/trending" element={<Trends />} />
								<Route path="/results" element={<Search />} />
							</Route>
							<Route path="/" element={<SimpleLayout />}>
								<Route path="/movie/:id" element={<Movie />} />
							</Route>
							<Route path="*" element={<Navigate replace to="/" />} />
						</Routes>
					</UserProvider>
				</React.Suspense>
			</BrowserRouter>
		</ThemeProvider>
	);
};

export default App;
