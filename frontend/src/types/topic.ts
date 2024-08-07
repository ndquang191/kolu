import { Admin } from "./admin";
import { Language } from "./language";
import { Question } from "./question";

export interface Topic {
	ID: number;
	topic_name: string;
	description: string;
	Questions: Question[];
	Languages: Language[];
	adminId: number;
	admin: Admin;
}
