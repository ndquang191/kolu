"use client";
import { ArrowUpDown, MoreHorizontal, PenIcon, Rotate3D, RotateCwSquare, Trash2Icon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Students from "./page";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Cookies from "js-cookie";
export type Students = {
	ID: number;
	student_id: string;
	name: string;
	class: string;
	email: string;
};

export const columns: ColumnDef<Students>[] = [
	{
		accessorKey: "student_id",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					ID
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "email",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Email
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "class",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Class
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		// cell: ({ row }) => {
		// 	const amount = parseFloat(row.getValue("amount"));
		// 	const formatted = new Intl.NumberFormat("en-US", {
		// 		style: "currency",
		// 		currency: "USD",
		// 	}).format(amount);

		// 	return <div className="text-right font-medium">{formatted}</div>;
		// },
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const token = Cookies.get("token");

			let student = row.original;
			let updatedStudent = student;
			const handleDelete = async (e: any, student_id: string) => {
				try {
					const response = await fetch(
						`${process.env.NEXT_PUBLIC_API_URL}admin/${student.student_id}`,
						{
							method: "DELETE",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${token}`,
							},
							// body: JSON.stringify(),
						}
					);

					if (!response.ok) {
						toast({
							title: "Student delete failed",
						});
					}

					const result = await response.json();

					toast({
						title: "Student deleted successfully",
					});
					window.location.reload();

					// Optionally, you can reset the form or show a success message to the user
				} catch (error) {
					toast({
						title: "Error",
						variant: "destructive",
					});
					// Optionally, show an error message to the user
				}
			};
			const handleUpdate = async (e: any) => {
				try {
					const response = await fetch(
						`${process.env.NEXT_PUBLIC_API_URL}admin/${student.ID}`,
						{
							method: "PUT",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${token}`,
							},
							body: JSON.stringify(student),
						}
					);

					if (!response.ok) {
						toast({
							title: "Student update failed",
						});
					}

					const result = await response.json();

					toast({
						title: result.message,
					});
					window.location.reload();
				} catch (error) {
					toast({
						title: "Error",
						variant: "destructive",
					});
				}
			};

			const handleInputChange = (e: any) => {
				const { id, value } = e.target;
				switch (id) {
					case "class":
						student.class = value;
						break;
					case "name":
						student.name = value;
						break;
					case "email":
						student.email = value;
						break;
				}

				console.log(student);
			};
			return (
				<div>
					<Dialog>
						<DialogTrigger asChild className="">
							<Button className="mr-2">
								<PenIcon />
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Edit student</DialogTitle>
								<DialogDescription>
									Make changes to the profile here. Click save when you are done.
								</DialogDescription>
							</DialogHeader>

							<div className="">
								<div className="my-2">
									<Label htmlFor={"name"}>Name</Label>
									<Input
										id={"name"}
										defaultValue={student.name}
										className=""
										onChange={(e) => handleInputChange(e)}
									/>
								</div>
								<div className="my-2">
									<Label htmlFor={"email"}>Email</Label>
									<Input
										id={"email"}
										defaultValue={student.email}
										className=""
										onChange={(e) => handleInputChange(e)}
									/>
								</div>
								<div className=" my-2 flex gap-2">
									<div>
										<Label htmlFor="class" className="">
											Class
										</Label>
										<Input
											id="class"
											defaultValue={student.class}
											onChange={(e) => handleInputChange(e)}
										/>
									</div>
									<div>
										<Label htmlFor="student_id" className="">
											Student ID
										</Label>
										<Input
											id="student_id"
											defaultValue={student.student_id}
											readOnly={true}
										/>
									</div>
								</div>
							</div>
							<DialogFooter>
								<Button type="submit" onClick={handleUpdate}>
									Save changes
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>

					<AlertDialog>
						<AlertDialogTrigger>
							<Button variant={"ghost"} className="border-2 border-blue-300 mr-2">
								<RotateCwSquare />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete your
									account and remove your data from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									className="bg-red-500 hover:bg-red-700"
									onClick={(e) => handleDelete(e, String(student.student_id))}
								>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>

					<AlertDialog>
						<AlertDialogTrigger>
							<Button variant={"destructive"}>
								<Trash2Icon />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete your
									account and remove your data from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									className="bg-red-500 hover:bg-red-700"
									onClick={(e) => handleDelete(e, String(student.student_id))}
								>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			);
		},
	},
];
