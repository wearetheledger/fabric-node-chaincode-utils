import * as _ from 'lodash';

/**
 * ChaincodeError
 */
export class ChaincodeError extends Error {

    private data: any;

    constructor(key: string, data?: any, stack?: any) {
        super(key);

        if (!_.isUndefined(stack)) {
            this.stack = stack;
        }

        this.data = data || {};
    }

    get serialized() {
        return JSON.stringify({
            'key': this.message,
            'data': this.data,
            'stack': this.stack
        });
    }

}