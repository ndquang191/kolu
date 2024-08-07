import Cookies from "js-cookie";
export const userInfo = () => {
	const user = Cookies.get("user");
	if (!user) {
		return {
			name: "",
			email: "",
			id: "",
			role: "",
			token: "",
		};
	}
	return JSON.parse(Cookies.get("user"));
};
