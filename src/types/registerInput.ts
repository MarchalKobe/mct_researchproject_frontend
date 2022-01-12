export default interface RegisterInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirm?: string;
    type: number;
};
