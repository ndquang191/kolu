"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FormAddCourse from "@/components/FormAddCourse";
import { fetchFunction } from "@/utils/fetchFunction";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { XIcon } from "lucide-react";

export default function Courses() {
	const [loading, setLoading] = useState(true);
	const [courseName, setCourseName] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [teachers, setTeachers] = useState([]);
	const [courses, setCourses] = useState([]);
	const [topics, setTopics] = useState([]);
	const [year, setYear] = useState(2024);
	const [open, setOpen] = useState(false);

	const [selectedTeacher, setSelectedTeacher] = useState();
	const [selectedTopic, setSelectedTopic] = useState();
	const [selectedSemester, setSelectedSemester] = useState();
	// const filteredCourses = useMemo(() => {
	// 	return courses.filter((course) => course.Name.toLowerCase().includes(searchTerm.toLowerCase()));
	// }, [courses, searchTerm]);

	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
	};
	const handleEdit = (courseId) => {
		window.location.href = `/admin/courses/${courseId}`;
		console.log(`Editing course with ID: ${courseId}`);
	};

	useEffect(() => {
		const loadData = async () => {
			try {
				const resTopics = await fetchFunction(
					`${process.env.NEXT_PUBLIC_API_URL}admin/topics`,
					"GET"
				);
				const resTeachers = await fetchFunction(
					`${process.env.NEXT_PUBLIC_API_URL}admin/admins`,
					"GET"
				);

				const resCourse = await fetchFunction(
					`${process.env.NEXT_PUBLIC_API_URL}admin/courses`,
					"GET"
				);

				// const { admins } = resTeachers
				const { admins } = resTeachers;
				setTeachers(admins);
				const { topics } = resTopics;
				setTopics(topics);

				const { courses } = resCourse;
				setCourses(courses);

				setLoading(false);
			} catch (error) {
				console.error("Error:", error);
			}
		};

		loadData();
	}, []);

	const handleAddCourse = async () => {
		const body = {
			name: courseName,
			teacher_id: selectedTeacher,
			semester: selectedSemester.toString(),
			topic_id: selectedTopic,
			year: year.toString(),
		};

		if (!courseName || !selectedTeacher || !selectedTopic || !year) {
			toast({
				title: "Please fill in all the required fields",
				variant: "destructive",
			});
			return;
		}

		const { course, message } = await fetchFunction(
			`${process.env.NEXT_PUBLIC_API_URL}admin/course`,
			"POST",
			body
		);
		window.location.href = `/admin/courses/${course.ID}`;
	};

	return loading ? (
		<div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
			<div className="flex items-center justify-center">Loading</div>
		</div>
	) : (
		<div className="w-full max-w-4xlpx-4 sm:px-6 lg:px-8 py-8">
			<div className="flex items-center justify-between my-4">
				<h1 className="text-[30px] font-extrabold my-2">Courses</h1>
				<div className="flex items-center gap-4">
					<Input
						type="text"
						placeholder="Search courses..."
						value={searchTerm}
						onChange={handleSearch}
						className="w-full max-w-md"
					/>
					<Dialog>
						<DialogTrigger className="w-full border-2 border-blue-600 rounded-md py-2">
							Add Course
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle className="flex justify-between">New course</DialogTitle>
								<DialogDescription>Add a new course </DialogDescription>
								<div className="my-2">
									<Label
										htmlFor="course_name"
										className="font-semibold text-md mb-2"
									>
										Course name
									</Label>
									<Input
										placeholder="Name"
										id="course_name"
										value={courseName}
										onChange={(e) => setCourseName(e.target.value)}
										className="my-4 "
									/>
								</div>
								{/* <div className="my-2">
									<Label
										htmlFor="course_description"
										className="font-semibold text-md mb-2"
									>
										Description
									</Label>
									<Input
										placeholder="Name"
										id="course_description"
										className="my-4"
									/>
								</div> */}
								<div className="grid grid-cols-3 gap-4 mb-6">
									<Select
										value={selectedTeacher}
										onValueChange={setSelectedTeacher}
									>
										<SelectTrigger className="w-[250px]">
											<SelectValue placeholder="Select a teacher" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectLabel>Teachers</SelectLabel>
												{teachers.map((teacher) => (
													<SelectItem
														key={teacher.ID}
														value={teacher.ID.toString()}
													>
														{teacher.name}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
									<div className="grid grid-cols-2 gap-4">
										<Select
											value={selectedSemester}
											onValueChange={setSelectedSemester}
										>
											<SelectTrigger className="w-[250px]">
												<SelectValue placeholder="Select semester" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectItem value={"Spring"}>
														Spring
													</SelectItem>
													<SelectItem value={"Summer"}>
														Summer
													</SelectItem>
													<SelectItem value={"Winter"}>
														Winter
													</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
										<Input
											value={year}
											onChange={(e) => setYear(e.target.value)}
											type="number"
										></Input>
									</div>
									<div className="w-full">
										<Select
											className="w-full"
											value={selectedTopic}
											onValueChange={setSelectedTopic}
										>
											<SelectTrigger className="">
												<SelectValue placeholder="Topic" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													{topics.map((topic) => (
														<SelectItem
															key={topic.ID}
															value={topic.ID.toString()}
														>
															{topic.topic_name}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="my-2">
									<Button className="w-full mt-4" onClick={handleAddCourse}>
										Add Course
									</Button>
								</div>
							</DialogHeader>
						</DialogContent>
					</Dialog>
				</div>
			</div>
			<div className="grid gap-6">
				{courses.map((course, index) => (
					<Card key={course.id} className="p-6">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="flex justify-between">
								<div>
									<h3 className="text-xl mb-2 font-bold">{course.Name}</h3>
									<p className="text-muted-foreground">{course.Description}</p>
								</div>
								<div className="flex justify-end ">
									<Button
										className="relative top-8"
										size="lg"
										variant="default"
										onClick={() => handleEdit(course.ID)}
									>
										Edit
									</Button>
								</div>
							</div>
							<div className="md:col-span-2 grid grid-cols-4 gap-4">
								<div className="flex gap-2">
									<p className="text-muted-foreground font-bold">Teacher:</p>
									<p>{course.Teacher ? course.Teacher.name : ""}</p>
								</div>
								<div className="flex gap-2">
									<p className="text-muted-foreground font-bold">Time:</p>
									<p>
										{course.Semester}, {course.Year}
									</p>
								</div>
								<div className="flex gap-2">
									<p className="text-muted-foreground font-bold">Topic:</p>
									<p>{course.Topic ? course.Topic.topic_name : ""}</p>
								</div>
							</div>
						</div>
					</Card>
				))}
			</div>
			{/* 
			<div className="relative">
				<div className="absolut top-4">
					<FormAddCourse />
				</div>
			</div> */}
		</div>
	);
}
