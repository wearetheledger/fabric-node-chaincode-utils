/**
 * ChaincodeError
 */
export declare class ChaincodeError extends Error {
    status: number;
    constructor(message: string, status?: number);
}
