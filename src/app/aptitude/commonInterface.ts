export interface Problem {
    questionNo: number
    slug: string
    title: string
    type: string
    marks: number
}

export interface QuestionTableProps {
    data: Problem[] | undefined;
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export interface FilterQuestionProps {
    title: string;
    type: "MCQ" | "MAQ" | "";
}