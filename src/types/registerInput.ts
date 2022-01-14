export default interface RegisterInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirm?: string;
    type: number;
};

export interface RegisterError {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    password: string | null;
    confirm: string | null;
};
