import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
export const login = async (email, password, type) => {
	console.log(email, password, type);
	try {
		const response = await fetch(`http://localhost:8000/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password, type }),
		});

		if (!response.ok) {
			throw new Error("Login failed");
		}

		const data = await response.json();
		const { token, user } = data;

		// Set token to cookies
		Cookies.set("token", token, { expires: 1 });
		Cookies.set("user", JSON.stringify(user), { expires: 1 });

		// Redirect to dashboard or home page
		console.log(user);
		if (user.type === "admin") {
			window.location.href = "/admin";
		} else if (user.type === "student") {
			window.location.href = "/student";
		} else {
			window.location.href = "/login";
		}
	} catch (error) {
		toast({
			title: error.message,
			variant: "destructive",
		});
	}
};
