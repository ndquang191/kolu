export interface SidebarItem {
	label: string;
	href: string;
	icon: string;
}

export type RoleSidebarItems = {
	[key: string]: SidebarItem[];
};
