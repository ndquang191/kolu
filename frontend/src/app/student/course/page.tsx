"use client";
import CourseInfo from "@/components/CourseInfo";
import { Separator } from "@/components/ui/separator";
import { fetchFunction } from "@/utils/fetchFunction";
import { Badge, BadgeCheck } from "lucide-react";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { userInfo } from "@/utils/userInfo";
const CourseList = () => {
	const user = userInfo();
	const [courses, setCourses] = React.useState<any>([]);
	useEffect(() => {
		const loadData = async () => {
			try {
				const { courses } = await fetchFunction(
					`${process.env.NEXT_PUBLIC_API_URL}student/course/student/${user.id}`,
					"GET"
				);

				console.log("COURSES", courses);
				setCourses(courses);
			} catch (error) {
				console.error("Error:", error);
			}
		};

		loadData();
	}, []);

	const handleCourseClick = (e: any, id: number) => {
		console.log("Course ID", id);
		window.location.href = `/student/course/${id}`;
	};
	return (
		<div className=" w-full">
			<div className="flex text-lg font-extrabold ml-5 my-3">
				<Badge className="mr-2" />
				On Going
			</div>
			<div className="flex flex-wrap gap-3 ">
				{courses.map((course: any, index: number) => (
					<CourseInfo
						key={index}
						name={course?.Name}
						percent={course?.percent || 0}
						teacher={course?.Teacher.name}
						id={course.ID}
						onClick={(e) => handleCourseClick(e, course.ID)}
					/>
				))}
				<CourseInfo
					name="Python basic"
					percent={50}
					teacher="John Doe"
					id={1}
					onClick={(e) => handleCourseClick(e, 1)}
				/>
				<CourseInfo
					name="DSA with Python"
					percent={50}
					teacher="John Doe"
					id={1}
					onClick={(e) => handleCourseClick(e, 1)}
				/>
				<CourseInfo
					name="Data analyst with Python"
					percent={10}
					teacher="Duy Quang"
					id={1}
					onClick={(e) => handleCourseClick(e, 1)}
				/>
			</div>
			<Separator className="mt-4" />
			<div className="flex text-lg font-extrabold ml-5 my-3">
				<BadgeCheck className="mr-2" />
				Completed
			</div>
			<div className="flex flex-wrap gap-3 ">
				<CourseInfo
					name="C++ Basic"
					percent={100}
					teacher=""
					id={1}
					onClick={(e) => handleCourseClick(e, 1)}
				/>
				<CourseInfo
					name="C++ Advance"
					percent={100}
					teacher="Duy Quang"
					id={1}
					onClick={(e) => handleCourseClick(e, 1)}
				/>
			</div>
		</div>
	);
};

export default CourseList;
