import Category from './Category';
import Level from './Level';

export default interface Assignment {
    assignmentId?: string;
    subject: string;
    category?: Category;
    position?: number;
    levels?: Level[];

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
