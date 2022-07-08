import { useState } from "react";
import axios from "axios";
const { REACT_APP_API_KEY } = process.env;
const BASE_URL = "https://api.themoviedb.org/3";

interface getItemsProps {
	initialValue: any[];
	destruct: string
}

const useGetItemsAPI = ({ initialValue = [], destruct }: getItemsProps) => {
	// TODO: Use sweetalert2 or something to inform the user if there was an error, and to advise if some actions were made successfully
	const [items, setItems] = useState(initialValue);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true)

	const api = axios.create({
		baseURL: BASE_URL,
		headers: {
			'Content-type': 'application/json'
		},
		params: {
			api_key: REACT_APP_API_KEY,
		}
	});

	// The param destruct is to directly destruct the different endpoints of the API, like genres
	async function getItems(path: string, params?: object) {
		setLoading(true);
		await api
			.get(path, { params: { ...params } })
			.then((res) => {
				setPage(page + 1);
				setItems(res.data[destruct])
				if (res.data.page === res.data.total_pages) return setHasMore(false);
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoading(false)
			});
	}

	async function getMoreItems(path: string, params?: object) {
		setLoading(true);

		await api
			.get(path, { params: { page: page, ...params } })
			.then((res) => {
				setItems((prevData) => [...prevData, ...res.data[destruct]])
				if (res.data.page === res.data.total_pages) return setHasMore(false);
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setPage(page + 1);
				setLoading(false)
			});
	}

	return [items, loading, getItems, getMoreItems, hasMore] as const;
};

interface getItemProps {
	initialValue: any;
	path: string;
}

const useGetItemAPI = ({ initialValue = {}, path }: getItemProps) => {
	const [item, setItem] = useState(initialValue);
	const [loading, setLoading] = useState(false);

	const api = axios.create({
		baseURL: BASE_URL,
		headers: {
			'Content-type': 'application/json'
		},
		params: {
			api_key: REACT_APP_API_KEY,
		}
	});

	async function getItem(params?: object) {
		setLoading(true);
		await api
			.get(path, { params: { ...params } })
			.then((res) => setItem(res.data))
			.catch((err) => console.log(err))
			.finally(() => setLoading(false));
	}

	return [item, loading, getItem] as const;
};

export { useGetItemAPI, useGetItemsAPI };
