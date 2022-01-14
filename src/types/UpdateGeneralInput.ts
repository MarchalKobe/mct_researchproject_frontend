export default interface UpdateGeneralInput {
    firstName: string;
    lastName: string;
};

export interface UpdateGeneralError {
    firstName: string | null;
    lastName: string | null;
};
