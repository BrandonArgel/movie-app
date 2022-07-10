import { useNavigate } from "react-router-dom";
import { useCallback, useContext, useEffect } from "react";
import { Back, Card, Loader, Preview } from "components";
import { useGetItemsAPI, useInfiniteScroll } from "hooks";
import { UserContext } from "context";

const Favorites = () => {
	const navigate = useNavigate();
	const { language, sessionId, texts, user } = useContext(UserContext);
	const [favorites, loadingFavorites, getFavorites, getMoreFavorites, hasMore] = useGetItemsAPI({
		initialValue: [],
		destruct: "results",
		msg: texts.errors.errorGet,
	});
	const lastMovieElementRef = useInfiniteScroll(
		() =>
			getMoreFavorites(`/account/${user.id}/favorite/movies`, {
				session_id: sessionId,
				language,
				include_image_language: language,
			}),
		loadingFavorites,
		hasMore
	);

	const initialRequest = useCallback(async (lang: string) => {
		const data = await getFavorites(`/account/${user.id}/favorite/movies`, {
			session_id: sessionId,
			language: lang,
			include_image_language: lang,
		});
		console.log({ data });
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!sessionId) navigate("/login");
		initialRequest(language);
	}, [sessionId, language]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Back button />
			<Preview title={texts.favorites.title} grid>
				{favorites.length > 0 ? (
					favorites.map(({ adult, id, overview, title, poster_path, vote_average }, i) => (
						<div key={id} ref={i === favorites.length - 1 ? lastMovieElementRef : null}>
							<Card
								id={id}
								adult={adult}
								title={title}
								overview={overview}
								link={`/movie/${id}`}
								voteAverage={vote_average}
								img={poster_path}
							/>
						</div>
					))
				) : (
					<>{!loadingFavorites && <p className="center">{texts.infiniteScroll.noResults}</p>}</>
				)}
			</Preview>
			{loadingFavorites && <Loader />}
			{!hasMore && !loadingFavorites && favorites.length > 0 && (
				<p className="center">{texts.infiniteScroll.limit}</p>
			)}
		</>
	);
};

export { Favorites };
