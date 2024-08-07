"use client";
import * as React from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { userInfo } from "@/utils/userInfo";
import Cookies from "js-cookie";
import { toast } from "@/components/ui/use-toast";
interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}
interface LanguagesState {
	python: boolean;
	cpp: boolean;
}
export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
	const { id } = userInfo();
	const token = Cookies.get("token");

	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
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
	// const [open, setOpen] = React.useState(false);
	const [description, setDescription] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [languages, setLanguages] = useState<LanguagesState>({
		python: false,
		cpp: false,
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setName(value);
	};

	const handleCheckboxChange = (e: any) => {
		const { id, checked } = e.target;
		console.log(id, e);
		// setLanguages((prev: LanguagesState) => ({
		// 	...prev,
		// 	[id]: checked,
		// }));
	};

	const handleAddTopic = async ({ name, description, arr, id }: any) => {
		const url = `${process.env.NEXT_PUBLIC_API_URL}admin/topic`;
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				topic_name: name,
				description,
				language_ids: arr,
				admin_id: id,
			}),
		});

		if (response.ok) {
			const { messege, topic } = await response.json();
			toast({
				title: "Topic added successfully",
				description: messege,
				variant: "destructive",
			});

			window.location.href = `/admin/topic/${topic.ID}`;
		} else {
			toast({
				title: "Something went wrong",
				description: "Something went wrong",
				variant: "destructive",
			});
		}
	};

	const handleTextareaChange = (e: any) => {
		const { value } = e.target;
		setDescription(value);
	};
	const handleSubmit = (e: any) => {
		console.log({ name, description, languages, id });

		if (languages.cpp == false && languages.python == false) {
			toast({
				title: "Please select at least one language",
				description: "Please select at least one language",
				variant: "destructive",
			});
			return;
		}
		const arr: number[] = convertLanguagesToNumber(languages);

		handleAddTopic({ name, description, arr, id });
		// Add your submission logic here
	};

	function convertLanguagesToNumber(languages: LanguagesState): number[] {
		const arr: number[] = [];
		if (languages.python) {
			arr.push(1);
		}
		if (languages.cpp) {
			arr.push(2);
		}
		return arr;
	}

	return (
		<div>
			<div className="flex items-center py-4">
				<div className="flex justify-between w-full">
					<div className="flex gap-3">
						<Select onValueChange={(e) => setSearchOption(e)}>
							<SelectTrigger className="w-[100px] mr-2">
								<SelectValue placeholder="Name" defaultValue={"name"} />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="name">Name</SelectItem>
									<SelectItem value="class">Teacher</SelectItem>
									<SelectItem value="email">Questions</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
						<Input
							placeholder="Filter...."
							value={table.getColumn(searchOption)?.getFilterValue() as string}
							onChange={(event) =>
								table.getColumn(searchOption)?.setFilterValue(event.target.value)
							}
							className="max-w-sm"
						/>
					</div>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="default">New Topic</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Add new topic</DialogTitle>
								<DialogDescription>
									Enter your information to add new topic.
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="name" className="text-right">
										Name
									</Label>
									<Input
										id="name"
										className="col-span-3"
										value={name}
										onChange={handleInputChange}
									/>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="description" className="text-right">
										Description
									</Label>
									<Input
										id="description"
										className="col-span-3"
										value={description}
										onChange={(e) => handleTextareaChange(e)}
									/>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<div className="text-right text-sm font-medium">Languages</div>
									<div>
										<div className="flex gap-3 mt-1">
											<Checkbox
												id="python"
												checked={languages.python}
												onCheckedChange={(e) => {
													setLanguages((prev: LanguagesState) => ({
														...prev,
														python: !prev.python,
													}));
												}}
												className="col-span-3"
											></Checkbox>
											<Label htmlFor="python" className="">
												Python
											</Label>{" "}
											<Checkbox
												id="cpp"
												checked={languages.cpp}
												onCheckedChange={(e) => {
													setLanguages((prev: LanguagesState) => ({
														...prev,
														cpp: !prev.cpp,
													}));
												}}
												className="col-span-3"
											></Checkbox>
											<Label htmlFor="cpp" className="">
												C++
											</Label>
										</div>
									</div>
								</div>
							</div>
							<DialogFooter>
								<Button type="submit" onClick={handleSubmit}>
									Save changes
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
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
