import { ChaincodeError } from './ChaincodeError';
import { ValidationError } from 'yup';
/**
 * ObjectValidationError
 */
export declare class ObjectValidationError extends ChaincodeError {
    value: any;
    /**
     * A string, indicating where there error was thrown. path is empty at the root level.
     */
    path: string;
    type: any;
    /**
     * array of error messages
     */
    errors: string[];
    /**
     * In the case of aggregate errors, inner is an array of ValidationErrors throw earlier in the validation chain.
     */
    inner: ValidationError[];
    params?: object;
    constructor(error: ValidationError);
}
