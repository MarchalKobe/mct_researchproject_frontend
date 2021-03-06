import { UserState } from '../store/modules/user';
import Languages from './Languages';
import Level from './Level';

export default interface Score {
    scoreId: string;
    code?: Languages;
    status: number;
    scores?: string;
    updated_at?: string;
    user?: UserState;
    level?: Level;
};
