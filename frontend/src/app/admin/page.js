"use client";

import { useAuth } from "@/hooks/useAuth";
import { userInfo } from "@/utils/userInfo";
import { useEffect } from "react";

export default function AdminDashboard() {
	useEffect(() => {
		console.log("Admin Dashboard");
	}, []);
	const { user, loading } = useAuth("admin");

	const userData = userInfo();
	if (loading) return <div>Loading...</div>;
	if (!user) return <div>Please login</div>;

	return (
		<div className="font-semibold text-lg w-full flex justify-center align-middle h-[200px]">
			Welcome to Admin Dashboard, {userData.name}
		</div>
	);
}
