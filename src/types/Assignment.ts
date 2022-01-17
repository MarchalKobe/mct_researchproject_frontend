import Category from "./Category";

export default interface Assignment {
    assignmentId?: string;
    subject: string;
    category?: Category;
    position?: number;

    selected?: boolean;
    top?: string;
    left?: string;
    width?: number;
    height?: number;
    xStart?: number;
    xEnd?: number;
    yStart?: number;
    yEnd?: number;
    ref?: HTMLElement;
};
