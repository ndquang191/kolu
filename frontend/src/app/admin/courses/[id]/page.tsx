"use client";
import * as XLSX from "xlsx";
import * as fs from "fs";
// import { Student } from "@/types/Student";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Topic } from "@/types/topic";
import { Language } from "@/types/language";
import { Question } from "@/types/question";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Course } from "@/types/course";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Enrollment } from "@/types/enrollment";
import { fetchFunction } from "@/utils/fetchFunction";
import { useParams } from "next/navigation";
import { PencilIcon, Trash, TrashIcon } from "lucide-react";
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
export default function DetailCourse({ params }: { params: { id: string } }) {
	const [studentIDs, setStudentIDs] = useState<number[]>([]);
	const [alertCSV, setAlertCSV] = useState<boolean>(false);
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [course, setCourse] = useState<Course>();
	const token = Cookies.get("token");
	const [enrollmentArr, setEnrollmentArr] = useState<any>();
	const [studentId, setStudentId] = useState("");
	const [students, setStudents] = useState<any>();
	const [topic, setTopic] = useState<any>();
	const [submissions, setSubmissions] = useState<any>();
	const fetchData = async () => {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}admin/course/${params.id}`, {
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

		const { course } = await response.json();
		return course;
	};
	useEffect(() => {
		const loadData = async () => {
			try {
				const data = await fetchData();
				setCourse(data);

				const { enrollments } = await fetchFunction(
					`${process.env.NEXT_PUBLIC_API_URL}admin/enrollments/course/${id}`,
					"GET"
				);

				const { students } = await fetchFunction(
					`${process.env.NEXT_PUBLIC_API_URL}admin/students/`,
					"GET"
				);

				const { submissions } = await fetchFunction(
					`${process.env.NEXT_PUBLIC_API_URL}admin/submissions/course/${id}`,
					"GET"
				);

				const { topic } = await fetchFunction(
					`${process.env.NEXT_PUBLIC_API_URL}admin/topic/${data.TopicID}`,
					"GET"
				);

				setTopic(topic);
				setSubmissions(submissions);
				setEnrollmentArr(enrollments);
				setStudents(students);
				setLoading(false);
				// console.log("Topic", topic);
			} catch (error) {
				console.error("Error:", error);
				// Handle error
			}
		};

		loadData();
	}, []);
	async function handleAddEnroll(event: any): Promise<void> {
		const body = {
			course_id: course?.ID,
			student_id: studentId,
			status: "active",
		};

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}admin/enrollment`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// Include authorization header if required
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(body),
		});
		if (!res.ok) {
			toast({
				title: "Error",
				description: "Failed to add enrollment",
				variant: "destructive",
			});
		}
		const { enrollment } = await res.json();
		setEnrollmentArr((prev: any) => [...prev, enrollment]);
	}
	// console.log("Course", course);
	console.log("Submissions", submissions);
	console.log("ENROLLMENT ARR", enrollmentArr);
	// console.log("STUDENTS", students);

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

		const validateArray = (arr: any[]): any[] => {
			return arr.filter(
				(item) => item != undefined && item != null
				// item.dob != ""
			);
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

			const students_id = csvData.map((row) => ({
				student_id: row[0],
			}));

			const validatedStudentIDs = validateArray(students_id);

			console.log("Students:", validatedStudentIDs);
			setStudentIDs(validatedStudentIDs);
		};

		reader.onerror = () => {
			alert("Error reading file");
		};

		reader.readAsText(file);
		setAlertCSV(true);
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
				body: JSON.stringify(studentIDs),
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
		<div className="w-full">
			{loading ? (
				<div>Loading</div>
			) : (
				<div className="w-full pt-5">
					<div className="font-extrabold text-[30px] my-2">{course?.Name}</div>
					<div className="mx-auto py-10 w-full">
						<Tabs defaultValue="stats" className="w-full">
							<TabsList className="flex justify-start items-start ">
								<TabsTrigger className="min-w-[200px]" value="stats">
									Stats
								</TabsTrigger>
								<TabsTrigger className="min-w-[200px]" value="students">
									Students
								</TabsTrigger>
								<TabsTrigger className="min-w-[200px]" value="score">
									Score
								</TabsTrigger>
							</TabsList>
							<TabsContent value="stats" className="w-[300%]">
								<div className="p-4 w-[100%] border-2 border-slate-100 rounded-sm">
									<div className="my-4">
										<span className="text-lg font-bold mr-2 ">
											{course?.Description}
										</span>
									</div>
									<div className=" my-4">
										<span className="text-lg font-bold mr-2 ">
											Teacher: {course?.Teacher?.name}
										</span>
									</div>

									<div className="my-4">
										<span className="text-lg font-bold mr-2">
											Total Students: {course?.Enrollments?.length}
										</span>
									</div>
									<div className="my-4">
										<span className="text-lg font-bold mr-2">
											Topic : {course?.Topic?.topic_name}
										</span>
									</div>
									<div>
										<span className="text-lg font-bold mr-2">
											Average Point :
										</span>
									</div>
								</div>
							</TabsContent>
							<TabsContent value="students">
								<div className="flex gap-2">
									<Dialog>
										<DialogTrigger className="mb-4">
											<Button variant="outline">New Enrollment</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Add new Students</DialogTitle>
												<DialogDescription></DialogDescription>
												<Label className="text-lg font-bold">
													Student ID
												</Label>
												<Input
													value={studentId}
													onChange={(e) =>
														setStudentId(e.target.value)
													}
													className="p-2 border-2 border-slate-100 rounded-sm"
													type="text"
												/>
											</DialogHeader>
											<Button variant="default" onClick={handleAddEnroll}>
												Add
											</Button>
										</DialogContent>
									</Dialog>

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
													This action cannot be undone. This will
													permanently delete your account and remove
													your data from our servers.
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
									<Input
										id="csvFile"
										type="file"
										className="hidden"
										onChange={handleUpFile}
									/>
								</div>
								<Table className="w-[1200px]">
									<TableHeader>
										<TableRow>
											<TableHead className="w-[100px]">#</TableHead>
											<TableHead>Name</TableHead>
											<TableHead>Student ID</TableHead>
											<TableHead className="text-right">Detail</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{enrollmentArr.map((enrollment: any, index: number) => (
											<TableRow key={index}>
												<TableCell className="w-[100px]">
													{index + 1}
												</TableCell>
												<TableCell>
													{
														students.find(
															(student: any) =>
																student.ID ===
																enrollment.StudentID
														)?.name
													}
												</TableCell>
												<TableCell>
													{
														students.find(
															(student: any) =>
																student.ID ===
																enrollment.StudentID
														)?.student_id
													}
												</TableCell>
												<TableCell className="text-right">
													<Button variant="destructive">
														<TrashIcon className="w-4 h-4" />
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
							</TabsContent>

							<TabsContent value="score">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											{topic?.Questions.map(
												(question: any, index: number) => (
													<TableHead key={index}>
														{index + 1}
													</TableHead>
												)
											)}
										</TableRow>
									</TableHeader>
									<TableBody>
										{enrollmentArr.map((enrollment: any, index: number) => (
											<TableRow key={index}>
												<TableCell className="w-[200px]">
													{
														students.find(
															(student: any) =>
																student.ID ===
																enrollment.StudentID
														)?.name
													}
												</TableCell>
												{topic?.Questions.map(
													(question: any, index: number) => (
														<TableCell key={index}>
															{
																submissions
																	.filter(
																		(submission: any) =>
																			submission.question_id ===
																				question.ID &&
																			submission.student_id ===
																				enrollment.StudentID
																	)
																	.sort((a: any, b: any) =>
																		a.score > b.score
																			? -1
																			: 1
																	)[0]?.score || "-"
															}
														</TableCell>
													)
												)}

												{/* I have enrollment.StudentID in submissions */}
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			)}
		</div>
	);
}
