import { useEffect } from "react";
import { Back, Card, Loader, Preview } from "components";
import { useGetItemsAPI } from "hooks/useApi";
import styles from "./trends.module.scss";

const Trends = () => {
	const [trends, loadingTrends, getTrends] = useGetItemsAPI([]);

	useEffect(() => {
		getTrends("/trending/movie/day", "results");
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Back button />
			<Preview title="Trens" grid>
				{loadingTrends ? (
					<Loader />
				) : (
					<>
						{trends.length > 0 ? (
							trends.map(
								({ adult, id, overview, title, poster_path, vote_average }) => (
									<Card
										id={id}
										key={id}
										adult={adult}
										title={title}
										overview={overview}
										link={`/movie/${id}`}
										voteAverage={vote_average}
										img={poster_path}
									/>
								)
							)
						) : (
							<p className={styles.center}>No results found.</p>
						)}
					</>
				)}
			</Preview>
		</>
	);
};

export { Trends };
