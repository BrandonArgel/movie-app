import { useState } from "react";
import { api, Toast } from "utils"
interface getItemsProps {
	initialValue: any[];
	destruct: string
	msg: string
}


const useGetItemsAPI = ({ initialValue = [], destruct, msg }: getItemsProps) => {
	// TODO: Use sweetalert2 or something to inform the user if there was an error, and to advise if some actions were made successfully
	const [items, setItems] = useState(initialValue);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true)

	// The param destruct is to directly destruct the different endpoints of the API, like genres
	const getItems = async (path: string, params?: object) => {
		setLoading(true);
		await api
			.get(path, { params: { ...params } })
			.then((res) => {
				setPage(page + 1);
				setItems(res.data[destruct])
				if (res.data.page === res.data.total_pages) return setHasMore(false);
			})
			.catch((err) => Toast.fire({
				icon: "error",
				title: msg,
			}).then(() => console.log(err)))
			.finally(() => {
				setLoading(false)
			});
	}

	const getMoreItems = async (path: string, params?: object) => {
		setLoading(true);

		await api
			.get(path, { params: { page: page, ...params } })
			.then((res) => {
				setItems((prevData) => [...prevData, ...res.data[destruct]])
				if (res.data.page === res.data.total_pages) return setHasMore(false);
			})
			.catch((err) => Toast.fire({
				icon: "error",
				title: msg,
			}).then(() => console.log(err)))
			.finally(() => {
				setPage(page + 1);
				setLoading(false)
			});
	}

	return [items, loading, getItems, getMoreItems, hasMore] as const;
};

interface getItemProps {
	path: string;
	msg: string;
}

const useGetItemAPI = ({ path, msg }: getItemProps) => {
	const [loading, setLoading] = useState(false);

	const getItem = async (params?: object) => {
		setLoading(true);
		return await api
			.get(path, { params: { ...params } })
			.then((res) => res.data)
			.catch((err) => Toast.fire({
				icon: "error",
				title: msg,
			}).then(() => console.log(err)))
			.finally(() => setLoading(false));
	}

	return [loading, getItem] as const;
};

interface postProps {
	path: string;
	msg?: string;
}

const usePostAPI = ({ path, msg }: postProps) => {
	const [loading, setLoading] = useState(false);

	const postItem = async (body: object, params?: object) => {
		setLoading(true);
		return await api
			.post(path, { ...body, ...params })
			.then((res) => res.data)
			.catch((err) => Toast.fire({
				icon: "error",
				title: msg,
			}).then(() => console.log(err)))
			.finally(() => setLoading(false));
	}

	return [loading, postItem] as const;
}

interface deleteItemProps {
	path: string;
	msg: string;
}

const useDeleteAPI = ({ path, msg }: deleteItemProps) => {
	const [loading, setLoading] = useState(false);

	const deleteItem = async (body: object, params?: object) => {
		setLoading(true);
		return await api
			.delete(path, { data: body, ...params })
			.then((res) => res.data)
			.catch((err) => Toast.fire({
				icon: "error",
				title: msg,
			}).then(() => console.log(err)))
			.finally(() => setLoading(false));
	}

	return [loading, deleteItem] as const;
}

// interface putItemProps {
// 	path: string;
// 	body: object;
// }

// const usePutItemAPI = ({ path, body }: putItemProps) => {
// 	const [loading, setLoading] = useState(false);

// 	async function putItem(params?: object) {
// 		setLoading(true);
// 		await api
// 			.put(path, { ...body, ...params })
// 			.then((res) => console.log(res))
// 			.catch((err) => console.log(err))
// 			.finally(() => setLoading(false));
// 	}

// 	return [loading, putItem] as const;
// }

export { useGetItemsAPI, useGetItemAPI, usePostAPI, useDeleteAPI };

