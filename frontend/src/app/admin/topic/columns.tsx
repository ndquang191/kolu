"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
import { Topic } from "@/types/topic";

export const columns: ColumnDef<Topic>[] = [
	{
		accessorKey: "ID",
		header: "ID",
	},
	{
		accessorKey: "topic_name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Name <ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "admin",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Teacher <ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const data = row.original;
			console.log("ROW", data);
			return <div>{data.admin.name}</div>;
		},
	},
	{
		accessorKey: "number",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Questions <ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const data = row.original;
			console.log("ROW", data);
			return <div>{data.Questions.length}</div>;
		},
	},

	{
		id: "actions",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Actions
				</Button>
			);
		},
		cell: ({ row }) => {
			const payment = row.original;

			return (
				<Button
					variant={"link"}
					onClick={() => (window.location.href = `/admin/topic/${row.original.ID}`)}
				>
					Detail
				</Button>
			);
		},
	},
];
