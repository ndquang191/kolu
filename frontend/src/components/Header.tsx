"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { LogOutIcon } from "lucide-react";
import { StarIcon } from "lucide-react";
import Cookies from "js-cookie";
import { userInfo } from "@/utils/userInfo";

export const logout = () => {
	Cookies.remove("token");
	Cookies.remove("user");
	window.location.href = "/login";
};

const Header = () => {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);
	const userData = userInfo();
	return (
		<header className="flex items-center justify-between px-4 py-3 shadow-sm dark:bg-gray-950  bg-[#BFDCFD] dark:text-gray-50 border-b-2 border-gray-200">
			<div className="flex items-center gap-2">
				<StarIcon className="h-6 w-6" />
				<span className="text-lg font-medium">Kalu Inc</span>
			</div>
			<div className="flex items-center gap-4">
				{isClient && <div>{userData.name}</div>}
				<Button onClick={logout} size="icon" variant="ghost">
					<LogOutIcon className="h-5 w-5" />
					<span className="sr-only">Logout</span>
				</Button>
			</div>
		</header>
	);
};

export default Header;
