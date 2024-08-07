"use client";
import { Button } from "@/components/ui/button";
import { fetchFunction } from "@/utils/fetchFunction";
import { userInfo } from "@/utils/userInfo";
import { BookIcon, Copy, Edit2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Question = ({ name, questionID }: { name: string; questionID: number }) => {
	const handleOnClick = (e: any) => {
		console.log("Question ID", questionID);
		window.location.href = `/student/practice/${questionID}`;
	};
	return (
		<div
			onClick={handleOnClick}
			className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm dark:bg-gray-950 hover:bg-gray-100 cursor-pointer border-2"
		>
			<div className="flex-1">
				<h3 className="font-medium">{name}</h3>
			</div>

			<div className="border-2 rounded-lg border-blue-500 h-5 w-5"></div>
		</div>
	);
};
const Page = () => {
	const user = userInfo();
	const { id } = useParams();
	const [loading, setLoading] = useState<Boolean>(true);
	const [course, setCourse] = useState<{ Name: string; Teacher: any }>();
	const [topic, setTopic] = useState<any>();
	useEffect(() => {
		const loadData = async () => {
			const resCourse = await fetchFunction(
				`${process.env.NEXT_PUBLIC_API_URL}student/course/${id}`,
				"GET"
			);

			const { course } = resCourse;
			setCourse(course);

			const { topic } = await fetchFunction(
				`${process.env.NEXT_PUBLIC_API_URL}student/topic/${course?.TopicID}`,
				"GET"
			);

			const submissions = await fetchFunction(
				`${process.env.NEXT_PUBLIC_API_URL}student/${user.id}/question/${id}/submissions`,
				"GET"
			);
			console.log(submissions);
			setTopic(topic);
			setLoading(false);
		};
		loadData();
	}, []);

	return (
		<div>
			{loading ? (
				<div>Loading</div>
			) : (
				<div className="w-[50%] mx-auto">
					<div className="">
						<div className="flex flex-col min-w-[500px] max-w-[800px] justify-between p-6 border-2 border-gray-600">
							<div className="flex items-center space-x-4">
								<BookIcon className="h-8 w-8 text-primary" />
								<h3 className="text-xl font-semibold">{course?.Name}</h3>
							</div>
							<div className="mt-3 text-gray-500 dark:text-gray-400">
								Teacher :
								<span className="font-medium ml-2">{course?.Teacher?.name}</span>
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-1 mt-4 justify-center align-middle">
						{topic?.Questions.map((question: any, index: number) => (
							<div className="min-w-[500px] max-w-[800px] mf-[20%] my-1" key={index}>
								<Question name={question.name} questionID={question.ID} />
							</div>
						))}
						{/* <div className="min-w-[500px] max-w-[800px] mf-[20%]  my-1">
							<Question name={"Two sum"} questionID={1} />
						</div> */}

						{/* <div className="min-w-[500px] max-w-[800px] mf-[20%] my-1">
							<Question name={"Palindrom Number"} questionID={1} />
						</div>
						<div className="min-w-[500px] max-w-[800px] mf-[20%] my-1">
							<Question name={"Longest common Prefix"} questionID={1} />
						</div>
						<div className="min-w-[500px] max-w-[800px] mf-[20%] my-1">
							<Question name={"Valid Parentheses"} questionID={1} />
						</div> */}
						{/* <div className="min-w-[500px] max-w-[800px] mf-[20%] my-1">
							<Question name={"Remove Duplicates from Sorted Array"} />
						</div> */}
						{/* <div className="min-w-[500px] max-w-[800px] mf-[20%] my-1">
							<Question name={"Climbing Stairs"} questionID={1} />
						</div>
						<div className="min-w-[500px] max-w-[800px] mf-[20%] my-1">
							<Question name={"Merge Sorted Array"} questionID={1} />
						</div>
						<div className="min-w-[500px] max-w-[800px] mf-[20%] my-1">
							<Question name={"Symmetric Tree"} questionID={1} />
						</div> */}
					</div>
				</div>
			)}
		</div>
	);
};

export default Page;
