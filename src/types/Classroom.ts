import UserType from './UserType';

export default interface Classroom {
    classroomId?: string;
    name?: string;
    classcode?: string;
    userCreated?: UserType;
    users?: UserType[];
};

// interface UserCreated {
//     userId: string;
// };
