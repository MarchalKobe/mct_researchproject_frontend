export default interface Classroom {
    classroomId: string;
    name: string;
    userCreated: UserCreated;
};

interface UserCreated {
    userId: string;
};
