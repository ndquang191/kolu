"use client";

import { useAuth } from "@/hooks/useAuth";
import { userInfo } from "@/utils/userInfo";

export default function StudentDashboard() {
	const { user, loading } = useAuth("student");

	const userData = userInfo();
	if (loading) return <div>Loading...</div>;
	if (!user) return <div>Please login</div>;

	return <div>Welcome to Student Dashboard, {userData.name}</div>;
}
