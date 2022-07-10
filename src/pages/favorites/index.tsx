import { useContext, useEffect } from "react";
import { Back, Card, Loader, Preview } from "components";
import { useGetItemsAPI, useInfiniteScroll } from "hooks";
import { UserContext } from "context";

const Favorites = () => {
	const { user, sessionId } = useContext(UserContext);
	const [favorites, loadingFavorites, getFavorites, getMoreFavorites, hasMore] = useGetItemsAPI({
		initialValue: [],
		destruct: "results",
	});
	const lastMovieElementRef = useInfiniteScroll(
		() => getMoreFavorites(`/account/${user.id}/favorite/movies`, { session_id: sessionId }),
		loadingFavorites,
		hasMore
	);

	useEffect(() => {
		if (!sessionId) return;
		getFavorites(`/account/${user.id}/favorite/movies`, { session_id: sessionId });
	}, [sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Back button />
			<Preview title="Your Favorites" grid>
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
					<>{!loadingFavorites && <p className="center">No results found.</p>}</>
				)}
			</Preview>
			{loadingFavorites && <Loader />}
			{!hasMore && !loadingFavorites && favorites.length > 0 && (
				<p className="center">Add more favorites to see more results!</p>
			)}
		</>
	);
};

export { Favorites };
