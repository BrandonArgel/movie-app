import { useCallback, useContext, useEffect, useState } from "react";
import { List, SearchBar, Slideshow, Slide, Preview } from "components";
import { UserContext } from "context";
import { useGetItemsAPI } from "hooks";

const Landing = () => {
	const {
		language,
		sessionId,
		texts,
		user: { id },
	} = useContext(UserContext);
	const [query, setQuery] = useState("");
	const [trends, loadingTrends, getTrends] = useGetItemsAPI({
		initialValue: [],
		destruct: "results",
		msg: texts.errors.errorGet,
	});
	const [favorites, loadingFavorites, getFavorites] = useGetItemsAPI({
		initialValue: [],
		destruct: "results",
		msg: texts.errors.errorGet,
	});
	const [watchlater, loadingWatchlater, getWatchlater] = useGetItemsAPI({
		initialValue: [],
		destruct: "results",
		msg: texts.errors.errorGet,
	});
	const [rated, loadingRated, getRated] = useGetItemsAPI({
		initialValue: [],
		destruct: "results",
		msg: texts.errors.errorGet,
	});
	const [categories, loadingCategories, getCategories] = useGetItemsAPI({
		initialValue: [],
		destruct: "genres",
		msg: texts.errors.errorGet,
	});
	const initialRequests = useCallback((lang: string) => {
		getTrends("/trending/movie/day", { language: lang, include_image_language: lang });
		getCategories("/genre/movie/list", { language: lang, include_image_language: lang });
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const getFavoritesRequest = (lang: string, session_id: string, account_id: number) => {
		getFavorites(`/account/${account_id}/favorite/movies`, {
			language: lang,
			session_id,
			include_image_language: language,
		});
	};

	const getWatchlaterRequest = (lang: string, session_id: string, account_id: number) => {
		getWatchlater(`/account/${account_id}/watchlist/movies`, {
			language: lang,
			session_id,
			include_image_language: language,
		});
	};

	const getRatedRequest = (lang: string, session_id: string, account_id: number) => {
		getRated(`/account/${account_id}/rated/movies`, {
			language: lang,
			session_id,
			include_image_language: language,
		});
	};

	const initialAccountRequests = useCallback(
		(lang: string, session_id: string, account_id: number) => {
			getFavoritesRequest(lang, session_id, account_id);
			getWatchlaterRequest(lang, session_id, account_id);
			getRatedRequest(lang, session_id, account_id);
		},
		[] // eslint-disable-line react-hooks/exhaustive-deps
	);

	useEffect(() => {
		initialRequests(language);
	}, [initialRequests, language]);

	useEffect(() => {
		if (!id || !sessionId) return;
		initialAccountRequests(language, sessionId, id);
	}, [language, sessionId, id]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<SearchBar value={query} setValue={setQuery} />
			<Preview title={texts.home.trends} link="/trending">
				<Slideshow loading={loadingTrends} speed={1000} slideAll>
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
							getFavorite={getFavoritesRequest}
							getWatchLater={getWatchlaterRequest}
							getRated={getRatedRequest}
						/>
					))}
				</Slideshow>
			</Preview>
			{sessionId && (
				<>
					<Preview title={texts.home.favorites} link="/favorites">
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
									getFavorite={getFavoritesRequest}
									getWatchLater={getWatchlaterRequest}
									getRated={getRatedRequest}
								/>
							))}
						</Slideshow>
					</Preview>
					<Preview title={texts.home.watchlater}>
						<Slideshow loading={loadingWatchlater} speed={300}>
							{watchlater.map(({ adult, id, overview, title, poster_path, vote_average }) => (
								<Slide
									id={id}
									key={id}
									adult={adult}
									title={title}
									overview={overview}
									link={`/movie/${id}`}
									voteAverage={vote_average}
									img={poster_path}
									getFavorite={getFavoritesRequest}
									getWatchLater={getWatchlaterRequest}
									getRated={getRatedRequest}
								/>
							))}
						</Slideshow>
					</Preview>
					<Preview title={texts.home.rated}>
						<Slideshow loading={loadingRated} speed={300}>
							{rated.map(({ adult, id, overview, title, poster_path, vote_average }) => (
								<Slide
									id={id}
									key={id}
									adult={adult}
									title={title}
									overview={overview}
									link={`/movie/${id}`}
									voteAverage={vote_average}
									img={poster_path}
									getFavorite={getFavoritesRequest}
									getWatchLater={getWatchlaterRequest}
									getRated={getRatedRequest}
								/>
							))}
						</Slideshow>
					</Preview>
				</>
			)}
			<Preview title={texts.home.categories}>
				<List items={categories} loading={loadingCategories} />
			</Preview>
		</>
	);
};

export { Landing };
