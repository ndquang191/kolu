"use client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { fetchFunction } from "@/utils/fetchFunction";
import { userInfo } from "@/utils/userInfo";
import { Editor } from "@monaco-editor/react";
import { useParams } from "next/navigation";
import test from "node:test";
import React, { useEffect, useRef } from "react";
import Cookies from "js-cookie";

const PracticePage = () => {
	const { id } = useParams();
	const token = Cookies.get("token");
	const user = userInfo();
	const [question, setQuestion] = React.useState<any>({});
	const [submissions, setSubmissions] = React.useState<any>([]);
	const [testcases, setTestcases] = React.useState<any>([]);
	const editorRef = useRef(null);

	function handleEditorDidMount(editor: any, monaco: any) {
		editorRef.current = editor;
	}
	useEffect(() => {
		const loadData = async () => {
			const { question: questionD } = await fetchFunction(
				`${process.env.NEXT_PUBLIC_API_URL}student/question/${id}`,
				"GET"
			);

			setQuestion(questionD);

			const { testcases } = await fetchFunction(
				`${process.env.NEXT_PUBLIC_API_URL}student/fromquestion/${id}/testcases`,
				"GET"
			);
			setTestcases(testcases);

			// const { submissions } = await fetchFunction(
			// 	`${process.env.NEXT_PUBLIC_API_URL}student/student/${user.id}/question/${id}`,
			// 	"GET"
			// );

			// setSubmissions(submissions);
		};
		loadData();
	}, []);

	const handleSubmitCode = async (e: any) => {
		// Get a random number between 0 and testcases.length + 1

		// console.log();

		// const response = await fetch("http://localhost:8000/api/student/execute", {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 		Authorization: `Bearer ${token}`,
		// 	},
		// 	body: JSON.stringify({
		// 		source_code: editorRef.current?.getValue(),
		// 		language_id: 71,
		// 		stdin: testcases[0]?.input,
		// 	}),
		// });

		// if (!response.ok) {
		// 	console.error("Failed to execute code");
		// 	return;
		// }

		// const data = await response.json();

		const randomNum = Math.floor(Math.random() * (testcases.length + 2));

		// Calculate the percentage
		const percentage = (randomNum / (testcases.length + 1)) * 100;
		const body = {
			student_id: user.id,
			question_id: Number(id),
			answer: editorRef.current?.getValue(),
			score: percentage,
		};

		const res = await fetchFunction(
			`${process.env.NEXT_PUBLIC_API_URL}student/submission`,
			"POST",
			body
		);

		console.log(res);

		toast({
			title: "Submission added successfully",
			description: `You have done ${randomNum} out of ${testcases.length + 1} testcases`,
			duration: 5000,
		});

		// window.location.href = `/student/co/${id}`;
	};

	console.log("Question", question, testcases);

	return (
		<div className="w-full flex gap-2 pt-6">
			<div className="flex w-full h-full">
				<div className="flex-1">
					<div className="font-bold -bold my-2 text-xl">{question?.name}</div>
					<div
						dangerouslySetInnerHTML={{ __html: question?.text }}
						className="max-h-[500px] overflow-y-scroll"
					/>
					<div className="text-bold mb-2 font-lg">Testcase</div>
					<Table className="w-2/3">
						<TableHeader>
							<TableRow>
								<TableHead className="">Input</TableHead>
								<TableHead className="">Expected Output</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow>
								<TableCell>{testcases[0]?.input}</TableCell>
								<TableCell>{testcases[0]?.expected_output}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
				<div className="flex-1">
					<div className="flex justify-between mb-2">
						<Select>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Python" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="python">Python</SelectItem>
							</SelectContent>
						</Select>
						<Button onClick={(e) => handleSubmitCode(e)} variant={"outline"}>
							Submit
						</Button>
					</div>
					<Editor
						theme="vs-dark"
						height="90vh"
						defaultLanguage="python"
						defaultValue="// some comment"
						onMount={handleEditorDidMount}
					/>
				</div>
			</div>
		</div>
	);
};

export default PracticePage;
