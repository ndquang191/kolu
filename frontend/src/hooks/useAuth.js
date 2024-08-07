"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function useAuth(requiredRole) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const user = Cookies.get("user");
		if (user) {
			const parsedUser = JSON.parse(user);
			setUser(parsedUser);
			if (requiredRole && parsedUser.role !== requiredRole) {
				window.location.href = "/unauthorized";
				console.log("Unauthorized");
			}
		} else {
			router.push("/login");
		}
		setLoading(false);
	}, [requiredRole]);

	return { user, loading };
}
