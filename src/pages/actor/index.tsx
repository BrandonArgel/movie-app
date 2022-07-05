import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Back, Card, Loader, Preview } from "components";
import { useGetItemAPI } from "hooks/useApi";
import styles from "./actor.module.scss";

import { IMG_BASE_URL } from "config";

const Actor = () => {
	// TODO: Implement pagination
	const { id } = useParams();
	const [actor, loading, getActor] = useGetItemAPI({}, { id });
	const { biography, name, birthday, deathday, place_of_birth, popularity, profile_path } =
		actor || {};

	useEffect(() => {
		getActor(`/person/${id}`);
	}, [id]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Back button />
			<Preview title={`${name} (${birthday} ${deathday ? " - " + deathday : ""})`}>
				{loading ? (
					<Loader />
				) : (
					<div className={styles.actor}>
						<img
							className={styles.actor__img}
							src={`${IMG_BASE_URL}/w500/${profile_path}`}
							alt={name}
						/>
						<p className={styles.actor__biography}>
							{biography} {place_of_birth}
						</p>
						<p className={styles.actor__popularity}>⭐{popularity}</p>
					</div>
				)}
			</Preview>
		</>
	);
};

export { Actor };
