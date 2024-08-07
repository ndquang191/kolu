"use client";
import { BookIcon } from "lucide-react";

import React from "react";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";

const handleClick = (e: any, id: number): void => {
	// Your function logic here
};
const CourseInfo = ({
	name,
	teacher,
	percent = 0,
	id = 1,
	onClick = (e: any) => {
		console.log("Test");
	},
}: {
	name: string;
	teacher: string;
	percent: number;
	id: number;
	onClick: (e: any) => void;
}) => {
	return (
		<Card
			className="p-6 bg-card text-card-foreground hover:border-2 cursor-pointer min-w-[100%] sm:min-w-[46%] "
			onClick={onClick}
		>
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h3 className="text-lg font-medium">{name}</h3>
					<p className="text-sm text-muted-foreground">Taught by {teacher}</p>
				</div>
				<div className="text-right">
					<div className="text-2xl font-bold">{percent}%</div>
					<p className="text-sm text-muted-foreground">Completed</p>
				</div>
			</div>
			<Progress value={percent} className="mt-4 h-2" />
		</Card>
	);
};

export default CourseInfo;
