import { Question } from "@/types/question";
const QuestionBlock = (question: Question) => {
	return <div>{question.name}</div>;
};

export default QuestionBlock;
