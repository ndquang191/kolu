import Cookies from "js-cookie";
import { toast } from "@/components/ui/use-toast";

export const fetchFunction = async (url, method, body) => {
	const token = Cookies.get("token");
	const response = await fetch(url, {
		method: method,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		toast({
			title: "Error",
			description: "Something went wrong",
			type: "error",
		});
		return;
	}

	return response.json();
};

export const fetchFuntionWithParams = async (url, method, body, params) => {
	const token = Cookies.get;
	const response = await fetch(url + "/" + params, {
		method: method,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		toast({
			title: "Error",
			description: "Something went wrong",
			type: "error",
		});
		return;
	}

	return response.json();
};
