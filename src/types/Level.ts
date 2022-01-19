import Assignment from "./Assignment";

export default interface Level {
    levelId?: string;
    level?: number; // 1: easy; 2: normal; 3: hard
    description?: string;
    status?: number; // 0: not started; 1: in progress; 2: ready
    assignment?: Assignment;
};