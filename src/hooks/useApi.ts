import { useState } from "react";
import axios from "axios";
const { REACT_APP_API_KEY } = process.env;
const BASE_URL = "https://api.themoviedb.org/3";

const useGetItemsAPI = (initialValue: any[] = [], params?: object) => {
	// TODO: Use sweetalert2 or something to inform the user if there was an error, and to advise if some actions were made successfully
	const [items, setItems] = useState(initialValue);
	const [loading, setLoading] = useState(false);

	const api = axios.create({
		baseURL: BASE_URL,
		headers: {
			'Content-type': 'application/json'
		},
		params: {
			api_key: REACT_APP_API_KEY,
			...params
		}
	});

	// The param destruct is to directly destruct the different endpoints of the API, like genres
	async function getItems(path: string, destruct: string) {
		setLoading(true);
		await api
			.get(path)
			.then((res) => {
				if (res.data[destruct].some((item: any) => item.poster_path)) {
					setItems(res.data[destruct].filter((item: any) => (item.poster_path || item.backdrop_path)))
				} else {
					setItems(res.data[destruct])
				}
			})
			.catch((err) => console.log(err))
			.finally(() => setLoading(false));
	}

	return [items, loading, getItems] as const;
};

const useGetItemAPI = (initialValue: any = {}, params?: object) => {
	const [item, setItem] = useState(initialValue);
	const [loading, setLoading] = useState(false);

	const api = axios.create({
		baseURL: BASE_URL,
		headers: {
			'Content-type': 'application/json'
		},
		params: {
			api_key: REACT_APP_API_KEY,
			...params
		}
	});

	async function getItem(path: string) {
		setLoading(true);
		await api
			.get(path)
			.then((res) => setItem(res.data))
			.catch((err) => console.log(err))
			.finally(() => setLoading(false));
	}

	return [item, loading, getItem] as const;
};

export { useGetItemAPI, useGetItemsAPI };
