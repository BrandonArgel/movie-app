import { useContext, useEffect } from "react";
import { UserContext } from "context";
import { Back, Card, Loader, Preview } from "components";
import { useGetItemsAPI, useInfiniteScroll } from "hooks";

const Trends = () => {
	const { language, texts } = useContext(UserContext);
	const [trends, loadingTrends, getTrends, getMoreTrends, hasMore] = useGetItemsAPI({
		initialValue: [],
		destruct: "results",
	});
	const lastMovieElementRef = useInfiniteScroll(
		() => getMoreTrends("/trending/movie/day", { language, include_image_language: language }),
		loadingTrends,
		hasMore
	);

	useEffect(() => {
		getTrends("/trending/movie/day", { language, include_image_language: language });
	}, [language]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Back button />
			<Preview title={texts.trends.title} grid>
				{trends.length > 0 ? (
					trends.map(({ adult, id, overview, title, poster_path, vote_average }, i) => (
						<div key={id} ref={i === trends.length - 1 ? lastMovieElementRef : null}>
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
					<>{!loadingTrends && <p className="center">{texts.infiniteScroll.noResults}</p>}</>
				)}
			</Preview>
			{loadingTrends && <Loader />}
			{!hasMore && !loadingTrends && trends.length > 0 && (
				<p className="center">{texts.infiniteScroll.limit}</p>
			)}
		</>
	);
};

export { Trends };
