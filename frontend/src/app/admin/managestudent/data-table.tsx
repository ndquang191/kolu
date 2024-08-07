"use client";
import * as React from "react";
import * as XLSX from "xlsx";
import * as fs from "fs";
import { Button } from "@/components/ui/button";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getPaginationRowModel,
	SortingState,
	getSortedRowModel,
	ColumnFiltersState,
	getFilteredRowModel,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
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

// FORM
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
const studentSchema = z.object({
	name: z.string().min(2).max(50),
	class: z.string().min(4).max(5),
	email: z.string().email(),
	student_id: z.string(),
	dob: z.date(),
});

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Toast } from "@/components/ui/toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import Cookies from "js-cookie";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}
interface Student {
	student_id: string;
	name: string;
	email: string;
	class: string;
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
	const router = useRouter();
	const { toast } = useToast();
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [studentsArr, setStudentsArr] = useState<Student[]>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [alertCSV, setAlertCSV] = useState<boolean>(false);
	const form = useForm<z.infer<typeof studentSchema>>({
		resolver: zodResolver(studentSchema),
		defaultValues: {
			name: "",
			class: "",
			email: "",
			student_id: "",
			dob: undefined,
		},
	});
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	});

	const [searchOption, setSearchOption] = useState("name");
	const [open, setOpen] = React.useState(false);

	const token = Cookies.get("token");
	const handleSubmit = async (values: z.infer<typeof studentSchema>) => {
		const token = Cookies.get("token");
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}admin/student`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(values),
			});

			if (!response.ok) {
				toast({
					title: "Student added failed",
				});
			}

			const result = await response.json();

			toast({
				title: "Student added successfully",
			});
			setTimeout(() => {
				window.location.reload();
			}, 3000);

			// Optionally, you can reset the form or show a success message to the user
		} catch (error) {
			toast({
				title: "Error",
				// description: ,
				variant: "destructive",
			});
			// Optionally, show an error message to the user
		}

		setOpen(false);
	};

	const handleUpFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (!file) {
			alert("No file selected");
			return;
		}

		if (file.type !== "text/csv") {
			alert("Please upload a CSV file");
			return;
		}

		const reader = new FileReader();

		const validateArray = (arr: Student[]): Student[] => {
			return arr.filter((item) => {
				// Check for any blank fields
				return (
					item.student_id != "" && item.name != "" && item.class != "" && item.email != ""
					// item.dob != ""
				);
			});
		};

		reader.onload = (event) => {
			const text = event.target?.result;
			if (typeof text !== "string") {
				alert("Failed to read file");
				return;
			}

			const rows = text.split("\n");
			const csvData = rows.map((row) => row.split(",").map((cell) => cell.trim()));

			console.log("CSV Data:", csvData);

			// Optionally, you can process the CSV data here

			// We gonna validate value here

			const students = csvData.map((row) => ({
				student_id: row[0],
				name: row[1],
				email: row[2],
				class: row[3],
			}));

			const validatedStudents = validateArray(students);

			console.log("Students:", validatedStudents);
			setStudentsArr(validatedStudents);
		};

		reader.onerror = () => {
			alert("Error reading file");
		};

		reader.readAsText(file);
		setAlertCSV(true);
	};

	const sleep = (ms: number) => {
		return new Promise((resolve) => setTimeout(resolve, ms));
	};

	const uploadFile = async (e: any) => {
		const url = `${process.env.NEXT_PUBLIC_API_URL}admin/students`;

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(studentsArr),
			});

			if (!response.ok) {
				alert("Failed to upload students");
				return;
			}

			const result = await response.json();
			toast({
				title: `Added ${result.count} accounts`,
			});
			// await sleep(3000);
			// window.location.reload();
		} catch (error) {
			console.error("Error uploading students:", error);
			alert("Error uploading students");
		}
	};

	return (
		<div className="">
			<div className="flex justify-between pr-5 ">
				<div className="flex items-center py-4">
					<Select onValueChange={(e) => setSearchOption(e)}>
						<SelectTrigger className="w-[100px] mr-2">
							<SelectValue placeholder="Name" defaultValue={"name"} />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="name">Name</SelectItem>
								<SelectItem value="class">Class</SelectItem>
								<SelectItem value="email">Email</SelectItem>
								<SelectItem value="student_id">ID</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<Input
						placeholder="Filter..."
						value={(table.getColumn(searchOption)?.getFilterValue() as string) ?? ""}
						onChange={(event) =>
							table.getColumn(searchOption)?.setFilterValue(event.target.value)
						}
						className="max-w-sm"
					/>
				</div>
				<div className="flex items-center gap-4 py-4">
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild className="">
							<Button className="my-4">Add </Button>
						</DialogTrigger>
						<Form {...form}>
							<DialogContent className="sm:max-w-md">
								<DialogHeader>
									<DialogTitle>Add New Student</DialogTitle>
									<DialogDescription>
										Enter your information to add new student.
									</DialogDescription>
								</DialogHeader>

								<form
									onSubmit={form.handleSubmit(handleSubmit)}
									className="space-y-4"
								>
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input placeholder="" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input placeholder="" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="flex gap-1">
										<FormField
											control={form.control}
											name="class"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Class</FormLabel>
													<FormControl>
														<Input placeholder="" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="student_id"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Student ID</FormLabel>
													<FormControl>
														<Input placeholder="" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="flex flex-col gap-1">
										<FormField
											control={form.control}
											name="dob"
											render={({ field }) => (
												<FormItem className="flex flex-col w-full">
													<FormLabel>Date of birth</FormLabel>
													<Popover>
														<PopoverTrigger asChild>
															<FormControl>
																<Button
																	variant={"outline"}
																	className={cn(
																		"w-[240px] pl-3 text-left font-normal",
																		!field.value &&
																			"text-muted-foreground"
																	)}
																>
																	{field.value ? (
																		format(
																			field.value,
																			"yyyy-MM-dd"
																		)
																	) : (
																		<span>
																			Pick a date
																		</span>
																	)}
																	<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
																</Button>
															</FormControl>
														</PopoverTrigger>
														<PopoverContent
															className="w-auto p-0"
															align="start"
														>
															<Calendar
																mode="single"
																selected={field.value}
																onSelect={field.onChange}
																disabled={(date) =>
																	date > new Date() ||
																	date <
																		new Date(
																			"1900-01-01"
																		)
																}
																initialFocus
															/>
														</PopoverContent>
													</Popover>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<DialogFooter>
										<div className="flex justify-end">
											<Button type="submit">Add</Button>
										</div>
									</DialogFooter>
								</form>
							</DialogContent>
						</Form>
					</Dialog>
					{/* <Button variant="default" size="default" className=""> */}
					<Label
						htmlFor="csvFile"
						className="border-2 border-blue-500 h-10 px-4 rounded-sm text-center flex justify-center align-middle"
					>
						<span className="h-fit mt-2">Import CSV</span>
					</Label>

					<AlertDialog onOpenChange={setAlertCSV} open={alertCSV}>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete your
									account and remove your data from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={(e) => uploadFile(e)}>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
					<Input id="csvFile" type="file" className="hidden" onChange={handleUpFile} />
					{/* /* <span className="sr-only">Add</span> */}
					{/* </Button> */}
				</div>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
