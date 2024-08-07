"use client";
import { useAuth } from "@/hooks/useAuth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { userInfo } from "@/utils/userInfo";
import { useEffect } from "react";

const Page = () => {
	useEffect(() => {
		const token = Cookies.get("token");
		if (token) {
			const userData = userInfo();
			if (userData) {
				if (userData.role === "admin") {
					window.location.href = "/admin";
				} else {
					window.location.href = "/student";
				}
			} else {
				window.location.href = "/login";
			}
		} else {
			window.location.href = "/login";
		}
	}, []);

	return (
		<div className="">
			<h1> Loading...</h1>
		</div>
	);
};

export default Page;
