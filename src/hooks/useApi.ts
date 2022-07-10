import { useState } from "react";
import { api, Toast } from "utils"
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
				title: "There was an error while fetching the data",
			}))
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
				title: "There was an error while fetching the data",
			}))
			.finally(() => {
				setPage(page + 1);
				setLoading(false)
			});
	}

	return [items, loading, getItems, getMoreItems, hasMore] as const;
};

interface getItemProps {
	path: string;
}

const useGetItemAPI = ({ path }: getItemProps) => {
	const [loading, setLoading] = useState(false);

	const getItem = async (params?: object) => {
		setLoading(true);
		return await api
			.get(path, { params: { ...params } })
			.then((res) => res.data)
			.catch((err) => Toast.fire({
				icon: "error",
				title: "There was an error while fetching the data",
			}))
			.finally(() => setLoading(false));
	}

	return [loading, getItem] as const;
};

interface postProps {
	path: string;
}

const usePostAPI = ({ path }: postProps) => {
	const [loading, setLoading] = useState(false);

	const postItem = async (body: object, params?: object) => {
		setLoading(true);
		return await api
			.post(path, { ...body, ...params })
			.then((res) => res.data)
			.catch((err) => err)
			.finally(() => setLoading(false));
	}

	return [loading, postItem] as const;
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

interface deleteItemProps {
	path: string;
}

const useDeleteAPI = ({ path }: deleteItemProps) => {
	const [loading, setLoading] = useState(false);

	const deleteItem = async (body: object, params?: object) => {
		setLoading(true);
		return await api
			.delete(path, { data: body, ...params })
			.then((res) => res.data)
			.catch((err) => Toast.fire({
				icon: "error",
				title: "There was an error while deleting the data",
			}))
			.finally(() => setLoading(false));
	}

	return [loading, deleteItem] as const;
}


export { useGetItemsAPI, useGetItemAPI, usePostAPI, useDeleteAPI };

