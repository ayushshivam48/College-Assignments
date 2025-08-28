import axios from 'axios';

const api = {
	get: async (url: string, config?: any) => {
		const { data } = await axios.get(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}${url}` : url, config);
		return data;
	},
	post: async (url: string, body?: any, config?: any) => {
		const { data } = await axios.post(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}${url}` : url, body, config);
		return data;
	},
	put: async (url: string, body?: any, config?: any) => {
		const { data } = await axios.put(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}${url}` : url, body, config);
		return data;
	},
	delete: async (url: string, config?: any) => {
		const { data } = await axios.delete(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}${url}` : url, config);
		return data;
	},
};

export default api;