import { useEffect } from "react";
import { Back, Card, Loader, Preview } from "components";
import { useGetItemsAPI, useInfiniteScroll } from "hooks";

const Trends = () => {
	const [trends, loadingTrends, getTrends, getMoreTrends, hasMore] = useGetItemsAPI({
		initialValue: [],
		destruct: "results",
	});
	const lastMovieElementRef = useInfiniteScroll(
		() => getMoreTrends("/trending/movie/day"),
		loadingTrends,
		hasMore
	);

	useEffect(() => {
		getTrends("/trending/movie/day");
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Back button />
			<Preview title="Trens" grid>
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
					<>{!loadingTrends && <p className="center">No results found.</p>}</>
				)}
			</Preview>
			{loadingTrends && <Loader />}
			{!hasMore && !loadingTrends && trends.length > 0 && (
				<p className="center">It seems there are no more results.</p>
			)}
		</>
	);
};

export { Trends };
