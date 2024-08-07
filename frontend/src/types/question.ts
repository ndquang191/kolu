import { TestCase } from "./testcase";

export interface Question {
	UpdatedAt: ReactNode;
	Updated_at: ReactNode;
	id: number;
	name: string;
	text: string;
	difficulty: string;
	topicId: number;
	testCases: TestCase[];
}
