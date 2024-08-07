"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
	SelectGroup,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogTitle,
	DialogHeader,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Admin } from "@/types/admin";
import Cookies from "js-cookie";
import { toast } from "@/components/ui/use-toast";
import { XIcon } from "lucide-react";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
export async function fetchData(): Promise<Admin[]> {
	const token = Cookies.get("token");
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}admin/admins`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				// Include authorization header if required
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			throw new Error("Failed to fetch students");
		}

		const { admins }: { admins: Admin[] } = await response.json();
		console.log("FETCHED ADMINS", admins);
		return admins;
	} catch (error) {
		console.error("Error fetching admins:", error);
		throw error;
	}
}

const Accounts: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [admins, setAdmins] = useState<Admin[]>([]);
	const [loading, setLoading] = useState(true);
	const [openEditUser, setOpenEditUser] = useState(false);
	const [newAdmin, setNewAdmin] = useState<Admin>({
		id: 0,
		createdAt: "",
		updatedAt: "",
		deletedAt: null,
		name: "",
		email: "",
		phone: "",
		password: "",
		role_id: 0,
		status: "active",
	});

	const roleRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const loadData = async () => {
			try {
				const admins = await fetchData();
				setAdmins(admins);
				setLoading(false);
			} catch (error) {
				console.error("Error:", error);
				setLoading(false);
				// Handle error (e.g., show error message to user)
			}
		};

		loadData();
	}, []);

	console.log("DATA", admins);
	if (loading) {
		return <div>Loading...</div>;
	}

	const handleUserEdit = (e: any) => {
		e.preventDefault();
		setOpenEditUser(true);
	};
	const uploadAccount = async (account: any) => {
		const token = Cookies.get("token");

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}admin/admin`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					// Include authorization header if required
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(account),
			});

			if (!response.ok) {
				toast({
					title: "Error creating account",
					description: "Please try again later",
					variant: "destructive",
				});
			}

			const { account: newAccount }: { account: Admin } = await response.json();

			console.log(account);
			setAdmins([...admins, newAccount]);
			setOpen(false);
		} catch (error) {
			console.error("Error creating account:", error);
		}
	};
	const handleCreateAccount = (e: any) => {
		e.preventDefault();
		console.log("newAdmin", roleRef.current?.innerHTML);

		uploadAccount({
			name: newAdmin.name,
			email: newAdmin.email,
			phone: newAdmin.phone,
			role_id: roleRef.current?.innerHTML === "Admin" ? 1 : 2,
		});
	};

	return (
		<div className="w-full pt-5">
			<div className="font-extrabold text-[30px] ">Accounts</div>

			<div>
				<Dialog onOpenChange={setOpen} open={open}>
					<DialogTrigger asChild>
						<Button className="mt-2 mb-4">Thêm mới</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Create New Account</DialogTitle>
							<DialogDescription>
								Enter your information to create a new account.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="">
								<div className="space-y-2">
									<Label htmlFor="name">Name</Label>
									<Input
										id="name"
										value={newAdmin.name}
										onChange={(e) =>
											setNewAdmin({ ...newAdmin, name: e.target.value })
										}
									/>
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									value={newAdmin.email}
									onChange={(e) =>
										setNewAdmin({ ...newAdmin, email: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="phone">Phone</Label>
								<Input
									id="phone"
									type="tel"
									value={newAdmin.phone}
									onChange={(e) =>
										setNewAdmin({ ...newAdmin, phone: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="role">Role</Label>
								<Select>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select a role" ref={roleRef} />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value="teacher">Teacher</SelectItem>
											<SelectItem value="admin">Admin</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
						</div>
						<DialogFooter>
							<Button type="submit" onClick={handleCreateAccount}>
								Create Account
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
			<Separator />
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Phone</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{admins.map((admin, index) => (
						<TableRow key={admin.id} className="hover:bg-slate-100">
							<TableCell>{index + 1}</TableCell>
							<TableCell>{admin.name}</TableCell>
							<TableCell>{admin.email}</TableCell>
							<TableCell>{admin.phone}</TableCell>
							<TableCell>{admin.role_id === 1 ? "Admin" : "Teacher"}</TableCell>
							<TableCell>
								{admin.status === "active" ? (
									<div className="flex items-center space-x-2">
										<div className="bg-green-500 rounded-lg h-2 w-2 "></div>
										<span>Active</span>
									</div>
								) : (
									<div className="flex items-center space-x-2">
										<div className="bg-red-500 rounded-lg h-2 w-2"></div>
										<span>Inactive</span>
									</div>
								)}
							</TableCell>
							<TableCell>
								<Button variant="outline" onClick={handleUserEdit}>
									Edit
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<div className="mt-2">
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious href="#" />
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#">1</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
						<PaginationItem>
							<PaginationNext href="#" />
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>

			<Dialog open={openEditUser} onOpenChange={setOpenEditUser}>
				{/* <DialogTrigger asChild>
					<Button variant="outline">Edit User</Button>
				</DialogTrigger> */}
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Edit User</DialogTitle>
						<div className="absolute top-4 right-4">
							<XIcon className="h-4 w-4" />
						</div>
					</DialogHeader>
					<form className="grid gap-4 py-4">
						<div className="grid grid-cols-2 items-center gap-4">
							<Label htmlFor="name">Name</Label>
							<Input id="name" placeholder="Enter name" value={"Nguyễn Duy Quang"} />
						</div>
						<div className="grid grid-cols-2 items-center gap-4">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="Enter email"
								value={"quang@gmail.com"}
							/>
						</div>
						<div className="grid grid-cols-2 items-center gap-4">
							<Label htmlFor="status">Status</Label>
							<Select>
								<SelectTrigger>
									<SelectValue
										placeholder="Select status"
										defaultValue={"active"}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="active">Active</SelectItem>
									<SelectItem value="inactive">Inactive</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="grid grid-cols-2 items-center gap-4">
							<Label htmlFor="role">Role</Label>
							<Select>
								<SelectTrigger>
									<SelectValue placeholder="Select role" defaultValue={"admin"} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="admin">Admin</SelectItem>
									<SelectItem value="teacher">Teacher</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</form>

					<DialogFooter>
						<Button type="submit" onClick={(e) => setOpenEditUser(false)}>
							Save Changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Accounts;
