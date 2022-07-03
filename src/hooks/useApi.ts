import { useState } from "react";
import axios from "axios";
const { REACT_APP_API_KEY } = process.env;

const useAPI = (baseURL: string, initialValue: any[] = [], params?: object) => {
	const [items, setItems] = useState(initialValue);
	const [loading, setLoading] = useState(false);

	const api = axios.create({
		baseURL,
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
				console.log(res)
				setItems(res.data[destruct])
			})
			.catch((err) => console.log(err))
			.finally(() => setLoading(false));
	}

	return [items, loading, getItems] as const;
};

export { useAPI };
