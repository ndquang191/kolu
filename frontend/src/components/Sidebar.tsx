"use client";
import {
	BookAIcon,
	CircleUserRound,
	HomeIcon,
	LayoutGridIcon,
	MountainIcon,
	Notebook,
	PenBoxIcon,
	PersonStandingIcon,
	ShoppingCartIcon,
	UsersIcon,
	Rows4,
	Settings2Icon,
} from "lucide-react";
import React, { FC, ReactNode, useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { RoleSidebarItems, SidebarItem } from "@/types/sidebar";
import { User } from "@/types/auth";
import { fetchFunction } from "@/utils/fetchFunction";
import { title } from "process";
import { toast } from "./ui/use-toast";

interface CustomLinkProps {
	direct: string;
	name: string;
	children: ReactNode;
}

const iconComponents: { [key: string]: React.ComponentType } = {
	BookAIcon,
	CircleUserRound,
	HomeIcon,
	LayoutGridIcon,
	MountainIcon,
	Notebook,
	PenBoxIcon,
	PersonStandingIcon,
	ShoppingCartIcon,
	UsersIcon,
	Rows4,
	Settings2Icon,
};

const sidebarItems: RoleSidebarItems = {
	admin: [
		{ label: "Dashboard", href: "/admin/", icon: "HomeIcon" },
		{ label: "Users", href: "/admin/users", icon: "CircleUserRound" },
		{ label: "Students", href: "/admin/managestudent", icon: "Rows4" },
		{ label: "Course", href: "/admin/courses", icon: "Notebook" },
		{ label: "Topic", href: "/admin/topic", icon: "PenBoxIcon" },
		{ label: "Settings", href: "/admin/topic", icon: "Settings2Icon" },
	],
	student: [
		{ label: "Dashboard", href: "/student/", icon: "HomeIcon" },
		{ label: "Courses", href: "/student/course", icon: "BookAIcon" },
		{ label: "Grades", href: "/student/grades", icon: "PenBoxIcon" },
	],
	teacher: [
		{ label: "Dashboard", href: "/admin/", icon: "HomeIcon" },
		{ label: "Course", href: "/admin/courses", icon: "Notebook" },
		{ label: "Topic", href: "/admin/topic", icon: "PenBoxIcon" },
	],

	default: [
		{ label: "Home", href: "/", icon: "HomeIcon" },
		{ label: "Profile", href: "/profile", icon: "UserIcon" },
	],
};

const CustomLink: FC<CustomLinkProps> = ({ direct, name, children }) => {
	return (
		<Link
			className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
			href={direct}
		>
			{children}
			{name}
		</Link>
	);
};

function useRoleBasedItems(): SidebarItem[] {
	const [items, setItems] = useState<SidebarItem[]>(sidebarItems.default);

	useEffect(() => {
		const userData = Cookies.get("user");
		if (userData) {
			const user: User = JSON.parse(userData);
			setItems(sidebarItems[user.role] || sidebarItems.default);
		}
	}, []);

	return items;
}

const Sidebar = () => {
	const items = useRoleBasedItems();
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		<div className="flex h-screen relative">
			<aside className=" left-0 z-10 flex h-[130%] w-60 flex-col border-r-2 border-gray-500 bg-[#BFDCFD] dark:border-gray-800 dark:bg-gray-950">
				<div className="flex-1 overflow-y-auto py-6">
					<nav className="space-y-1">
						{isClient &&
							items.map((item: SidebarItem, index: number) => {
								const Icon = iconComponents[item.icon];
								return (
									<CustomLink key={index} name={item.label} direct={item.href}>
										{Icon && <Icon />}
									</CustomLink>
								);
							})}
					</nav>
				</div>
			</aside>
			<main className="flex-1 p-6" />
		</div>
	);
};

export default Sidebar;
