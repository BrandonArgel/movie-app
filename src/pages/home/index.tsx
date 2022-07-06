import { useState, useEffect, useCallback } from "react";
import { List, SearchBar, Slideshow, Slide, Preview } from "components";
import { useGetItemsAPI } from "hooks/useApi";

const Landing = () => {
	const [query, setQuery] = useState("");
	const [trends, loadingTrends, getTrends] = useGetItemsAPI([]);
	const [categories, loadingCategories, getCategories] = useGetItemsAPI([]);

	const initialRequests = useCallback(() => {
		getTrends("/trending/movie/day", "results");
		getCategories("/genre/movie/list", "genres");
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		initialRequests();
	}, [initialRequests]);

	return (
		<>
			<SearchBar value={query} setValue={setQuery} />
			<Preview title="Trending Movies" link="/trending">
				<Slideshow loading={loadingTrends} speed={300}>
					{trends.map(({ adult, id, overview, title, poster_path, vote_average }) => (
						<Slide
							id={id}
							key={id}
							adult={adult}
							title={title}
							overview={overview}
							link={`/movie/${id}`}
							voteAverage={vote_average}
							img={poster_path}
							slide={true}
						/>
					))}
				</Slideshow>
			</Preview>
			<Preview title="Categories">
				<List items={categories} loading={loadingCategories} />
			</Preview>
		</>
	);
};

export { Landing };
