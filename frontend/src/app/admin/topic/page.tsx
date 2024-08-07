"use client";
import { useEffect, useState } from "react";

import { columns } from "./columns";
import { Topic } from "@/types/topic";
import { DataTable } from "./data-table";
import { fetchFunction } from "@/utils/fetchFunction";

async function getData(): Promise<Topic[]> {
	const { topics } = await fetchFunction(`${process.env.NEXT_PUBLIC_API_URL}admin/topics`, "GET");
	console.log("TOPICS", topics);
	return topics;
}

export default function TopicsPage() {
	const [data, setData] = useState<Topic[]>([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const loadData = async () => {
			try {
				const data = await getData();
				setData(data);
				setLoading(false);
			} catch (error) {
				console.error("Error:", error);
				// Handle error
			}
		};
		loadData();
	}, []);
	return (
		<div className="w-full pt-5">
			<div className="font-extrabold text-[30px] my-2">Topics</div>
			<div className="mx-auto ">
				<DataTable columns={columns} data={data} />
			</div>
		</div>
	);
}
