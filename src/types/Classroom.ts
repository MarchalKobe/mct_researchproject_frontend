import UserType from './UserType';

export default interface Classroom {
    classroomId?: string;
    name?: string;
    classcode?: string;
    open?: boolean;
    userCreated?: UserType;
    users?: UserType[];
};
