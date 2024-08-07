"use client";
import { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import hljs from "highlight.js";
import "quill/dist/quill.snow.css";

export default function Editor() {
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

	useEffect(() => {
		if (quill) {
			console.log("Quill is initialized", quill); // Debugging log

			// Handle text change events
			quill.on("text-change", () => {
				const content = quill.root.innerHTML; // Get HTML content
				setEditorContent(content);
				console.log("Content updated", content); // Debugging log
			});
		} else {
			console.log("Quill is not initialized yet"); // Debugging log
		}
	}, [quill]);
	return (
		<div className="h-[600px] w-[811px]">
			<div className="" ref={quillRef} />;
		</div>
	);
}
