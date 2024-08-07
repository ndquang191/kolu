import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDaysIcon } from "lucide-react";

export default function FormAddCourse() {
	return (
		<Card className="w-full max-w-2xl">
			<CardHeader>
				<CardTitle>Create New Course</CardTitle>
				<CardDescription>Fill out the form to create a new course.</CardDescription>
			</CardHeader>
			<CardContent>
				<form className="grid gap-6">
					<div className="grid gap-2">
						<Label htmlFor="name">Course Name</Label>
						<Input id="name" placeholder="Enter course name" />
					</div>
					<div className="grid gap-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							placeholder="Enter course description"
							className="min-h-[120px]"
						/>
					</div>
					<div className="grid sm:grid-cols-2 gap-6">
						<div className="grid gap-2">
							<Label htmlFor="teacher">Teacher</Label>
							<Select>
								<SelectTrigger id="teacher">
									<SelectValue placeholder="Select teacher" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="john-doe">John Doe</SelectItem>
									<SelectItem value="jane-smith">Jane Smith</SelectItem>
									<SelectItem value="bob-johnson">Bob Johnson</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="start-date">Start Date</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="w-full justify-start text-left"
									>
										<CalendarDaysIcon className="mr-2 h-4 w-4" />
										<span>Select start date</span>
									</Button>
								</PopoverTrigger>
								<PopoverContent className="p-0">
									<Calendar />
								</PopoverContent>
							</Popover>
						</div>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="topic">Topic</Label>
						<Select>
							<SelectTrigger id="topic">
								<SelectValue placeholder="Select topic" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="web-development">Web Development</SelectItem>
								<SelectItem value="data-science">Data Science</SelectItem>
								<SelectItem value="machine-learning">Machine Learning</SelectItem>
								<SelectItem value="business">Business</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex justify-end">
				<Button>Create Course</Button>
			</CardFooter>
		</Card>
	);
}
