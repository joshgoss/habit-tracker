import { getAccessToken } from "../utils/session";

const API_URL = process.env.REACT_APP_API_URL;

interface ApiOptions {
	method: "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
	endpoint: string;
	body?: object;
	queryParams?: Record<string, any>;
}

export const apiFetch = async (options: ApiOptions) => {
	// store and convert values within the query params object as strings as required by URLSearchParams
	let strQueryRecord: Record<string, string> = {};
	if (options.queryParams) {
		strQueryRecord = Object.keys(options.queryParams).reduce((acc, key) => {
			const v = options.queryParams ? options.queryParams[key] : "";
			acc[key] = v;
			return acc;
		}, strQueryRecord);
	}

	const queryString = new URLSearchParams(strQueryRecord);
	const url = `${API_URL}${options.endpoint}${
		queryString.toString() ? "?" + queryString.toString() : ""
	}`;
	const accessToken = getAccessToken();
	const response = await fetch(url, {
		body: options.body ? JSON.stringify(options.body) : undefined,
		method: options.method,
		cache: "no-cache",
		headers: {
			Authorization: accessToken ? `Bearer ${accessToken}` : "",
			"Content-Type": "application/json;charset=utf-8"
		},
		credentials: "same-origin",
		mode: "cors",
		redirect: "follow",
		referrerPolicy: "no-referrer"
	});

	return await response.json();
};

const destroy = async (endpoint: string, queryParams?: Record<string, any>) => {
	return await apiFetch({ method: "DELETE", endpoint, queryParams });
};

const get = async (endpoint: string, queryParams?: Record<string, any>) => {
	return await apiFetch({ method: "GET", endpoint, queryParams });
};

const patch = async (
	endpoint: string,
	body: object,
	queryParams?: Record<string, any>
) => {
	return await apiFetch({ method: "PATCH", endpoint, body, queryParams });
};

const post = async (
	endpoint: string,
	body: object,
	queryParams?: Record<string, any>
) => {
	return await apiFetch({ method: "POST", endpoint, body, queryParams });
};

const put = async (
	endpoint: string,
	body: object,
	queryParams?: Record<string, any> | undefined
) => {
	return await apiFetch({ method: "PUT", endpoint, body, queryParams });
};

const api = { get, destroy, patch, post, put };
export default api;
