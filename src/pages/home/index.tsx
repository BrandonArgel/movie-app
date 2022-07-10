import { useCallback, useContext, useEffect, useState } from "react";
import { List, SearchBar, Slideshow, Slide, Preview } from "components";
import { UserContext } from "context";
import { useGetItemsAPI } from "hooks";

const Landing = () => {
	const { language, sessionId, texts, user } = useContext(UserContext);
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

	const initialRequests = useCallback((lang: string) => {
		getTrends("/trending/movie/day", { language: lang, include_image_language: lang });
		getCategories("/genre/movie/list", { language: lang, include_image_language: lang });
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		initialRequests(language);
	}, [initialRequests, language]);

	useEffect(() => {
		if (!sessionId) return;
		getFavorites(`/account/${user.id}/favorite/movies`, {
			session_id: sessionId,
			language,
			include_image_language: language,
		});
	}, [sessionId, language]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<SearchBar value={query} setValue={setQuery} />
			<Preview title={texts.home.trends.title} link="/trending">
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
				<Preview title={texts.home.favorites.title} link="/favorites">
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
			<Preview title={texts.home.categories.title}>
				<List items={categories} loading={loadingCategories} />
			</Preview>
		</>
	);
};

export { Landing };
