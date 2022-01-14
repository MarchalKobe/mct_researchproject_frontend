export default interface UpdatePasswordInput {
    current: string;
    password: string;
    confirm: string;
};

export interface UpdatePasswordError {
    current: string | null;
    password: string | null;
    confirm: string | null;
};
