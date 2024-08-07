import { Topic } from "./topic";
import { Admin } from "./admin";
import { Enrollment } from "./enrollment";
export interface Course {
	ID: number;
	Name: string;
	Description: string;
	TopicID: number;
	Topic: Topic;
	TeacherID: number;
	Teacher: Admin;
	Semester: string;
	Year: string;
	Enrollments: Enrollment[];
	CreatedAt: Date;
	UpdatedAt: Date;
}
