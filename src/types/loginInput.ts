export default interface LoginInput {
    email: string;
    password: string;
};

export interface LoginError {
    email: string | null;
    password: string | null;
};
