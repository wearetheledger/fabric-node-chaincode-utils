import shim = require('fabric-shim');
import { ChaincodeInterface, ChaincodeResponse, ChaincodeStub } from 'fabric-shim';
import { Helpers } from './utils/helpers';
import { LoggerInstance } from 'winston';
import { StubHelper } from './StubHelper';
import { Transform } from './utils/datatransform';
import { ChaincodeError } from './utils/errors/ChaincodeError';
import { InternalServerError } from './utils/errors/InternalServerError';

import {serializeError} from 'serialize-error';

/**
 * The Chaincode class is a base class containing handlers for the `Invoke()` and `Init()` function which are required
 * by `fabric-shim`. The `Init()` function can be overwritten by just implementing it in your Chaincode implementation
 * class.
 */
export class Chaincode implements ChaincodeInterface {

    public logger: LoggerInstance;

    constructor(logLevel?: string) {
        this.logger = Helpers.getLoggerInstance(this.name, logLevel);
    }

    /**
     * the name of the current chaincode.
     *
     * @readonly
     * @type {string}
     * @memberof Chaincode
     */
    get name(): string {
        return this.constructor.name;
    }

    /**
     * The Init method is called when the Smart Contract is instantiated by the blockchain network
     * Best practice is to have any Ledger initialization in separate function -- see initLedger()
     *
     * @param {ChaincodeStub} stub
     * @returns {Promise<ChaincodeResponse>}
     * @memberof Chaincode
     */
    async Init(stub: ChaincodeStub): Promise<ChaincodeResponse> {
        this.logger.info(`=========== Instantiated ${this.name} chaincode ===========`);

        this.logger.info(`Transaction ID: ${stub.getTxID()}`);
        this.logger.info(`Args: ${stub.getArgs().join(',')}`);

        let ret = stub.getFunctionAndParameters();

        return await this.executeMethod('init', ret.params, stub, true);

    }

    /**
     * The Invoke method is called as a result of an application request to run the Smart Contract.
     * The calling application program has also specified the particular smart contract
     * function to be called, with arguments
     *
     * @param {ChaincodeStub} stub
     * @returns {Promise<ChaincodeResponse>}
     * @memberof Chaincode
     */
    async Invoke(stub: ChaincodeStub): Promise<ChaincodeResponse> {

        this.logger.info(`=========== Invoked Chaincode ${this.name} ===========`);
        this.logger.info(`Transaction ID: ${stub.getTxID()}`);
        this.logger.info(`Args: ${stub.getArgs().join(',')}`);

        let ret = stub.getFunctionAndParameters();

        return await this.executeMethod(ret.fcn, ret.params, stub);

    }

    /**
     * Handle custom method execution
     *
     * @param {string} fcn
     * @param {string[]} params
     * @param stub
     * @param {boolean} silent
     * @returns {Promise<any>}
     */
    private async executeMethod(fcn: string, params: string[], stub: ChaincodeStub, silent = false) {
        let method = this[fcn];

        if (!method) {
            if (!silent) {
                this.logger.error(`no function of name: ${fcn} found`);

                return shim.error(Buffer.from(JSON.stringify(serializeError(new ChaincodeError(`no function of name: ${fcn} found`, 400)))));
            } else {
                return shim.success();
            }
        }

        try {
            this.logger.debug(`============= START : ${fcn} ===========`);

            let payload = await method.call(this, new StubHelper(stub), params);

            if ((payload !== undefined && payload !== null) && !Buffer.isBuffer(payload)) {
                payload = Buffer.from(JSON.stringify(Transform.normalizePayload(payload)));
            }

            this.logger.debug(`============= END : ${fcn} ===========`);

            return shim.success(payload);

        } catch (err) {
            let error = err;

            this.logger.error(err);

            if (error.name !== 'ChaincodeError') {
                error = new InternalServerError(error.message);
            }

            delete error.stack;

            return shim.error(Buffer.from(JSON.stringify(serializeError(error))));
        }
    }
}
