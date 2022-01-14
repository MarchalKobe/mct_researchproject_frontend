export default interface Classroom {
    classroomId?: string;
    name?: string;
    classcode?: string;
    userCreated?: UserCreated;
};

interface UserCreated {
    userId: string;
};
