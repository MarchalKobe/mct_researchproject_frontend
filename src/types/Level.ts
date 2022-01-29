import Assignment from './Assignment';
import Languages from './Languages';
import Score from './Score';

export default interface Level {
    levelId?: string;
    level?: number; // 1: easy; 2: normal; 3: hard
    description?: string;
    status?: number; // 0: not started; 1: in progress; 2: ready
    assignment?: Assignment;
    code?: Languages;
    startcode?: Languages;
    scores?: Score[];
};
