import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "context";
import { AdultContent, Avatar, Back, ButtonTheme, Button, List, Select } from "components";
import { MovieInterface } from "utils";
import { lazyLoading, loaderImg } from "utils";
import { toggleFavorite } from "utils";
import styles from "./banner.module.scss";

import { IMG_BASE_URL } from "config";

const Banner = ({
	adult,
	accountState,
	backdrop,
	children,
	id,
	genres,
	loading,
	loadingState,
	overview,
	sessionId,
	title,
	voteAverage,
}: MovieInterface) => {
	const navigate = useNavigate();
	const { language, setLanguage, texts, user } = useContext(UserContext);
	const imgRef = useRef<HTMLImageElement>(null);
	const [favorite, setFavorite] = useState(accountState?.favorite);

	const onToggleFavorite = async () => {
		if (!sessionId) navigate("/login");
		if (!accountState) return;
		const fav = favorite !== undefined ? !favorite : !accountState?.favorite;
		const messages = {
			add: texts.messages.addFavorite,
			remove: texts.messages.rmFavorite,
		};
		const data = await toggleFavorite(sessionId, id, fav, messages);
		setFavorite(data as boolean);
	};

	useEffect(() => {
		if (imgRef.current) {
			lazyLoading(imgRef, true, true);
		}
	}, [loading]);

	return (
		<div className={styles.banner}>
			<Back />
			{loading ? (
				<div className="skeleton">
					<img
						className={`${styles.banner__img} hide`}
						width={500}
						height={281}
						alt="loader"
						src={loaderImg(500, 201)}
					/>
				</div>
			) : (
				<picture>
					<source
						srcSet={backdrop ? `${IMG_BASE_URL}/original/${backdrop}` : ""}
						media="(min-width: 1280px)"
						type="image/jpg"
					/>
					<source
						srcSet={backdrop ? `${IMG_BASE_URL}/w1280/${backdrop}` : ""}
						media="(max-width: 1279px)"
						type="image/jpg"
					/>
					<source
						srcSet={backdrop ? `${IMG_BASE_URL}/w500/${backdrop}` : ""}
						media="(max-width: 500px)"
						type="image/jpg"
					/>
					<div className="skeleton">
						<img
							className={`${styles.banner__img} hide`}
							src={backdrop ? `${IMG_BASE_URL}/original/${backdrop}` : ""}
							alt={title}
							width={500}
							height={281}
							ref={imgRef}
						/>
					</div>
				</picture>
			)}
			<div className={styles.banner__info}>
				<div className={styles.banner__content}>
					<div className={styles.banner__controls}>
						<ButtonTheme />
						<div className={styles.banner__controls_select}>
							<Select
								title="Change languaje"
								options={texts.header.languages}
								setValue={setLanguage}
								value={language}
							/>
							{sessionId && (
								<Link to="/account">
									<Avatar src={user?.avatar} alt={user?.username} />
								</Link>
							)}
						</div>
					</div>
					<h1 className={styles.banner__title}>
						{title}
						<span>
							⭐{voteAverage}
							{adult && <AdultContent />}
						</span>
					</h1>
					<p className={styles.banner__overview}>{overview}</p>
					<div className={styles.banner__more}>
						<List items={genres} loading={loading} />
						<Button
							className={`${styles.banner__more_favorites}`}
							onClick={onToggleFavorite}
							loading={loadingState}
						>
							{favorite !== undefined
								? favorite
									? texts.banner.remove
									: texts.banner.add
								: accountState?.favorite
								? texts.banner.remove
								: texts.banner.add}
						</Button>
					</div>
					{children}
				</div>
			</div>
		</div>
	);
};

export { Banner };
