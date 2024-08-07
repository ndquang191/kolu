"use client";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Topic } from "@/types/topic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { Testcase } from "@/types/testcase";
import TextEditor from "@/components/TextEditor";
import { fetchFunction } from "@/utils/fetchFunction";
import CodeEditor from "@/components/CodeEditor";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { useQuill } from "react-quilljs";
import hljs from "highlight.js";
import "quill/dist/quill.snow.css";
import { toast } from "@/components/ui/use-toast";

export default function NewQuestion() {
	const { id } = useParams<{ id: string }>();
	const [topic, setTopic] = useState<Topic>();
	const editorRef = useRef(null);
	// topic_name / admin_name
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");
	const [questionName, setQuestionName] = useState("");
	const [code, setCode] = useState("");
	const [loading, setLoading] = useState(true);
	const [testcases, setTestcases] = useState<Testcase[]>([]);

	function handleEditorDidMount(editor: any, monaco: any) {
		editorRef.current = editor;
	}

	const { quill, quillRef } = useQuill({
		theme: "snow",
		modules: {
			syntax: { hljs },
			toolbar: [
				["bold", "italic", "underline", "strike"],
				[{ list: "ordered" }, { list: "bullet" }],
				[{ script: "sub" }, { script: "super" }],
				[{ indent: "-1" }, { indent: "+1" }],
				["code-block"],
				[{ header: [1, 2, 3, 4, 5, 6, false] }],
				["clean"],
			],
		},
	});

	const [editorContent, setEditorContent] = useState("");
	const [tcInput, setTcInput] = useState("");
	const [tcExpectedOutput, setTcExpectedOutput] = useState("");

	const handleAddTestcase = () => {
		const newTestcase: Testcase = {
			id: Math.random(),
			input: tcInput,
			expectedOutput: tcExpectedOutput,
			questionId: Number(id),
		};
		setTestcases([...testcases, newTestcase]);
		setTcInput("");
		setTcExpectedOutput("");
		setOpen(false);
	};

	useEffect(() => {
		if (quill) {
			const handleChange = () => {
				setEditorContent(quill.root.innerHTML);
			};

			quill.on("text-change", handleChange);

			// Cleanup listener on unmount
			return () => {
				quill.off("text-change", handleChange);
			};
		}
	}, [quill]);

	useEffect(() => {
		const loadData = async () => {
			try {
				const res = await fetchFunction(
					`${process.env.NEXT_PUBLIC_API_URL}admin/topic/${id}`,
					"GET"
				);
				const { topic } = res;
				// console.log("FETCHED TOPIC", topic);
				setLoading(false);
				setTopic(topic);
			} catch (error) {
				console.error("Error:", error);
			}
		};
		loadData();
	}, []);

	const handleCreateQuestion = async () => {
		const body = {
			name: questionName,
			text: editorContent,
			topic_id: Number(id),
			testcases: testcases,
		};
		const res = await fetchFunction(`${process.env.NEXT_PUBLIC_API_URL}admin/question`, "POST", body);
		console.log("Create Question", res);

		toast({
			title: "Question created successfully",
			description: "You can now edit the question",
			duration: 5000,
		});

		setTimeout(() => {
			window.location.href = `/admin/topic/${id}/`;
		}, 2000);
	};

	const saveQuestionHandler = async () => {
		console.log("Save question");
	};

	const detailQuestionForm = useMemo(
		() => (
			<div className="flex justify-start gap-10 w-fit">
				<div className="w-full">
					<div className="flex gap-4 my-6">
						<Label htmlFor="q_name" className="font-semibold">
							Name
						</Label>
						<Input
							id="q_name"
							value={questionName}
							onChange={(e) => setQuestionName(e.target.value)}
							className=""
						></Input>
					</div>
					<div className="h-[600px] w-[811px]">
						<div className="" ref={quillRef} />
					</div>
				</div>
				<div className="flex flex-col my-6">
					{/* <Button className="my-3" variant={"outline"} onClick={saveQuestionHandler}>
						Save changes
					</Button> */}
				</div>
			</div>
		),
		[questionName, quillRef]
	);

	return (
		<div className="w-full pt-5">
			<div className="font-extrabold text-[30px] my-2">New question for {topic?.topic_name}</div>
			<div className="mx-auto py-5 w-full">
				<Tabs defaultValue="details" className="w-[100%]">
					<TabsList className="flex justify-start items-start ">
						<TabsTrigger value="details">Question detail</TabsTrigger>
						<TabsTrigger value="testcase">Testcases</TabsTrigger>
						<TabsTrigger value="preview">Preview</TabsTrigger>
					</TabsList>
					<TabsContent value="details" className="">
						{/* <div className="flex justify-start gap-10 w-fit">
							<div className="w-full">
								<div className="flex gap-4 my-6">
									<Label htmlFor="q_name" className="font-semibold">
										Name
									</Label>
									<Input
										id="q_name"
										value={questionName}
										onChange={(e) => setQuestionName(e.target.value)}
										className=""
									></Input>
								</div>
								<div className="h-[600px] w-[811px]">
									<div className="" ref={quillRef} />
								</div>
							</div>
							<div className="flex flex-col my-6">
								<Button
									className="my-3"
									variant={"outline"}
									onClick={saveQuestionHandler}
								>
									Save changes
								</Button>
								<Button className="my-3" onClick={handleCreateQuestion}>
									Create question
								</Button>
							</div>
						</div> */}
						{detailQuestionForm}
					</TabsContent>
					<TabsContent value="testcase">
						<div className="flex justify-start w-4/5">
							<Table className="w-2/3">
								<TableHeader>
									<TableRow>
										<TableHead className="">Input</TableHead>
										<TableHead className="">Expected Output</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{testcases.map((testcase, index) => (
										<TableRow key={index}>
											<TableCell>{testcase.input}</TableCell>
											<TableCell>{testcase.expectedOutput}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							<div className="flex flex-col">
								{/* <Button
									className="my-3"
									variant={"outline"}
									onClick={saveQuestionHandler}
								>
									Save changes
								</Button> */}
								<Button
									className="my-3"
									variant={"default"}
									onClick={handleCreateQuestion}
								>
									Create question
								</Button>
								<Dialog open={open} onOpenChange={setOpen}>
									<DialogTrigger>
										<Button
											variant={"secondary"}
											className="my-3"
											onClick={saveQuestionHandler}
										>
											New testcase
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>New testcase</DialogTitle>
											<DialogDescription>
												<Label
													htmlFor="input"
													className="font-semibold mb-2 "
												>
													Input
												</Label>
												<Textarea
													className="my-4"
													id="input"
													value={tcInput}
													onChange={(e) => setTcInput(e.target.value)}
												></Textarea>
												<Label
													className="font-semibold mb-2"
													htmlFor="output"
												>
													Expected Output
												</Label>
												<Textarea
													id="output"
													value={tcExpectedOutput}
													onChange={(e) =>
														setTcExpectedOutput(e.target.value)
													}
												></Textarea>
											</DialogDescription>
										</DialogHeader>
										<DialogFooter>
											<Button
												className="my-3"
												variant={"outline"}
												onClick={handleAddTestcase}
											>
												Add testcase
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</div>
						</div>
					</TabsContent>
					<TabsContent value="preview">
						<div className="flex">
							<div className="w-1/2 border-2 border-gray-200 rounded-md p-2">
								<div className="text-bold mb-2 font-lg">{questionName}</div>
								<div
									dangerouslySetInnerHTML={{ __html: editorContent }}
									className="max-h-[500px] overflow-y-scroll"
								/>
								<div className="font-bold mb-2 text-lg">Testcase</div>
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
											<TableCell>{testcases[0]?.expectedOutput}</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</div>

							<div className="w-1/2">
								<Editor
									theme="vs-dark"
									height="90vh"
									defaultLanguage="javascript"
									defaultValue="// some comment"
									onMount={handleEditorDidMount}
								/>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
