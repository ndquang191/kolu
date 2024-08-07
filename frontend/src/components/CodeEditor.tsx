"use client";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import { useRef } from "react";

const CodeEditor = ({ submissions, setSubmissions }: any) => {
	const editorRef = useRef(null);

	function handleEditorDidMount(editor: any, monaco: any) {
		editorRef.current = editor;
	}

	return (
		<div>
			<Editor
				theme="vs-dark"
				height="90vh"
				defaultLanguage="python"
				defaultValue="// some comment"
				onMount={handleEditorDidMount}
			/>
		</div>
	);
};

export default CodeEditor;
