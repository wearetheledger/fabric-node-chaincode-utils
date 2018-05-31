import { ChaincodeError } from './ChaincodeError';

/**
 * NotFoundError
 */
export class NotFoundError extends ChaincodeError {

    constructor(message = '') {
        super(message, 404);
    }

}
