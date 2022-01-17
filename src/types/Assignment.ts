import Category from "./Category";

export default interface Assignment {
    assignmentId?: string;
    subject: string;
    category?: Category;
    position?: number;
};
