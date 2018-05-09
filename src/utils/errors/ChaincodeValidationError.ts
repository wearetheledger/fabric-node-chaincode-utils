import { ChaincodeError } from './ChaincodeError';
import { ValidationError } from 'yup';

/**
 * ChaincodeValidationError
 */
export class ChaincodeValidationError extends ChaincodeError {

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

    constructor(error: ValidationError) {

        // Calling parent constructor of base Error class.
        super(error.message, 400);

        this.errors = error.errors;
        this.params = error.params;
        this.path = error.path;
        this.value = error.value;
        this.inner = error.inner;
        this.type = error.type;
    }

}
