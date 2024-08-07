"use client";
import { useEffect, useState } from "react";
import { columns, Students } from "./columns";
import { DataTable } from "./data-table";
import Cookies from "js-cookie";

export async function fetchData(): Promise<Students[]> {
	const token = Cookies.get("token");
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}admin/students/`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				// Include authorization header if required
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			throw new Error("Failed to fetch admins");
		}

		const { students }: { students: Students[] } = await response.json();
		console.log("FETCHED STUDENTS", students);
		return students;
	} catch (error) {
		console.error("Error fetching admins:", error);
		throw error;
	}
}

function StudentsList() {
	const [data, setData] = useState<Students[]>([]);
	const [loading, setLoading] = useState<Boolean>(true);
	useEffect(() => {
		const loadData = async () => {
			try {
				const studentsData = await fetchData();
				setData(studentsData);
				setLoading(false);
			} catch (error) {
				console.error("Error:", error);
				// Handle error
			}
		};

		loadData();
	}, []);
	console.log(data);
	return (
		<>
			{loading ? (
				<div>Loading</div>
			) : (
				<div className="w-full pt-5">
					<div className="font-extrabold text-[30px] ">Students</div>

					<div className="mx-auto">
						<DataTable columns={columns} data={data} />
					</div>
				</div>
			)}
		</>
	);
}

export default StudentsList;
