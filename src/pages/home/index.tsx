import { useCallback, useContext, useEffect, useState } from "react";
import { List, SearchBar, Slideshow, Slide, Preview } from "components";
import { UserContext } from "context";
import { useGetItemsAPI } from "hooks";

const Landing = () => {
	const { user, sessionId } = useContext(UserContext);
	const [query, setQuery] = useState("");
	const [trends, loadingTrends, getTrends] = useGetItemsAPI({
		initialValue: [],
		destruct: "results",
	});
	const [favorites, loadingFavorites, getFavorites] = useGetItemsAPI({
		initialValue: [],
		destruct: "results",
	});
	const [categories, loadingCategories, getCategories] = useGetItemsAPI({
		initialValue: [],
		destruct: "genres",
	});

	const initialRequests = useCallback(() => {
		getTrends("/trending/movie/day");
		getCategories("/genre/movie/list");
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		initialRequests();
	}, [initialRequests]);

	useEffect(() => {
		if (!sessionId) return;
		getFavorites(`/account/${user.id}/favorite/movies`, { session_id: sessionId });
	}, [sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

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
			{sessionId && (
				<Preview title="Your Favorites" link="/favorites">
					<Slideshow loading={loadingFavorites} speed={300}>
						{favorites.map(({ adult, id, overview, title, poster_path, vote_average }) => (
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
			)}
			<Preview title="Categories">
				<List items={categories} loading={loadingCategories} />
			</Preview>
		</>
	);
};

export { Landing };
