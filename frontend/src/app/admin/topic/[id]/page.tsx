"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Topic } from "@/types/topic";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
export default function Page({ params }: { params: { id: string } }) {
	const [loading, setLoading] = useState(true);
	const [topic, setTopic] = useState<Topic>();
	const token = Cookies.get("token");
	const fetchData = async () => {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}admin/topic/${params.id}`, {
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

		const { topic } = await response.json();
		console.log("FETCHED TOPIC");
		return topic;
	};
	useEffect(() => {
		const loadData = async () => {
			try {
				const topic = await fetchData();
				setTopic(topic);
				console.log(topic);
				setLoading(false);
			} catch (error) {
				console.error("Error:", error);
				// Handle error
			}
		};

		loadData();
	}, []);
	function handleAddQuestion(event: any): void {
		window.location.href = `/admin/topic/${params.id}/q`;
	}

	console.log(topic);
	return (
		<div>
			{loading ? (
				<div>Loading</div>
			) : (
				<div className="w-full pt-5">
					<div className="font-extrabold text-[30px] my-2">{topic?.topic_name}</div>
					<div className="mx-auto py-10">
						<Tabs defaultValue="stats" className="w-full">
							<TabsList className="grid grid-cols-2 w-[400px]">
								<TabsTrigger value="stats">Stats</TabsTrigger>
								<TabsTrigger value="questions">Questions</TabsTrigger>
							</TabsList>
							<TabsContent value="stats" className="">
								<div className="p-1 w-[100%] border-2 border-slate-100 rounded-sm">
									<div className="flex gap-4">
										<Card className="min-w-[300px] ">
											<CardHeader>
												<CardTitle>
													<span className="text-xxl font-bold mr-2 ">
														Created by
													</span>
												</CardTitle>
											</CardHeader>
											<CardContent>
												<span className="text-lg">
													{topic?.admin?.name}
												</span>
											</CardContent>
										</Card>
										<Card className="min-w-[300px] ">
											<CardHeader>
												<CardTitle>
													<span className="text-xxl font-bold mr-2 ">
														Description
													</span>
												</CardTitle>
											</CardHeader>
											<CardContent>
												<span className="text-lg">
													{" "}
													{topic?.description}
												</span>
											</CardContent>
										</Card>
									</div>

									<div className="flex gap-4 mt-4">
										<Card className="min-w-[300px] w-fit">
											<CardHeader>
												<CardTitle>
													<span className="text-xxl font-bold mr-2 ">
														Total Questions
													</span>
												</CardTitle>
											</CardHeader>
											<CardContent>
												<span className="text-lg">
													{topic?.Questions?.length || 0}
												</span>
											</CardContent>
										</Card>

										<Card className="min-w-[300px] w-fit">
											<CardHeader>
												<CardTitle>
													<span className="text-xxl font-bold mr-2 ">
														Using Languages
													</span>
												</CardTitle>
											</CardHeader>
											<CardContent>
												<span className="text-lg">
													{topic?.Languages?.map(
														(language) => language.Name
													).join(", ")}
												</span>
											</CardContent>
										</Card>
										<Card className="min-w-[300px] w-fit">
											<CardHeader>
												<CardTitle>
													<span className="text-xxl font-bold mr-2 ">
														Average Point
													</span>
												</CardTitle>
											</CardHeader>
											<CardContent>
												<span className="text-lg">
													{Math.round(Math.random() * 100)}
												</span>
											</CardContent>
										</Card>
									</div>
								</div>
							</TabsContent>
							<TabsContent value="questions">
								<Button onClick={handleAddQuestion}>Add Question</Button>
								<Table className="w-[1200px]">
									<TableHeader>
										<TableRow>
											<TableHead className="w-[100px]">#</TableHead>
											<TableHead>Name</TableHead>
											<TableHead>Last updated</TableHead>
											<TableHead className="text-right">Action</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{topic?.Questions?.map((question, index) => (
											<TableRow key={index}>
												<TableCell className="font-medium">
													{index + 1}
												</TableCell>
												<TableCell>{question.name}</TableCell>
												<TableCell>
													{format(question?.UpdatedAt, "dd/MM/yyyy")}
												</TableCell>
												<TableCell className="text-right">
													<Button variant="outline">Edit</Button>
												</TableCell>
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
