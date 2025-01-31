"use client";
import React from "react";

import { useQuill } from "react-quilljs";
// or const { useQuill } = require('react-quilljs');

// import "quill/dist/quill.snow.css"; // Add css for snow theme
// or import 'quill/dist/quill.bubble.css'; // Add css for bubble theme

const Practice = () => {
	const { quill, quillRef } = useQuill();

	console.log(quill); // undefined > Quill Object
	console.log(quillRef); // { current: undefined } > { current: Quill Editor Reference }

	return (
		<div className="">
			<div ref={quillRef} />
		</div>
	);
};

export default Practice;
