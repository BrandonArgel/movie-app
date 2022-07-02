import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout, Loader } from "components";
const Landing = React.lazy(() => import("pages"));

const App = () => {
	return (
		<BrowserRouter>
			<React.Suspense fallback={<Loader />}>
				<a className="skip-to-content" href="#content">
					Saltar al contenido
				</a>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<Landing />} />
					</Route>
					{/* <Route path="*" element={<NoMatch />} /> */}
				</Routes>
			</React.Suspense>
		</BrowserRouter>
	);
};

export default App;
