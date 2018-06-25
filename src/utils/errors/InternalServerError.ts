import { ChaincodeError } from './ChaincodeError';

/**
 * InternalServerError
 */
export class InternalServerError extends ChaincodeError {

    constructor(message = '') {
        super(message, 500);
    }

}
