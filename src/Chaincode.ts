import shim = require('fabric-shim');
import { ChaincodeInterface, Stub, ChaincodeReponse } from 'fabric-shim';
import { Helpers } from './utils/helpers';
import { LoggerInstance } from 'winston';
import { ERRORS } from './constants/errors';
import { ChaincodeError } from './ChaincodeError';
import { TransactionHelper } from './ChaincodeStub';
import { Transform } from './utils/datatransform';

export class Chaincode implements ChaincodeInterface {

    private logger: LoggerInstance;

    constructor() {
        this.logger = Helpers.log(this.name);
    }

    /**
     * the name of the current chaincode.
     * 
     * @readonly
     * @type {string}
     * @memberof Chaincode
     */
    get name() :string{
        return this.constructor.name;
    }

    /**
     * the Default TransactionHelper with extra functionality and return your own instance.
     * 
     * @param {Stub} stub 
     * @returns the transaction helper for the given stub. This can be used to extend
     * @memberof Chaincode
     */
    getTransactionHelperFor(stub: Stub) {

        return new TransactionHelper(stub);
    }

    /**
     * The Init method is called when the Smart Contract is instantiated by the blockchain network
     * Best practice is to have any Ledger initialization in separate function -- see initLedger()
     * 
     * @param {Stub} stub 
     * @returns {Promise<ChaincodeReponse>} 
     * @memberof Chaincode
     */
    async Init(stub: Stub): Promise<ChaincodeReponse> {
        this.logger.info(`=========== Instantiated ${this.name} chaincode ===========`);

        return shim.success();
    }

    /**
     * The Invoke method is called as a result of an application request to run the Smart Contract.
     * The calling application program has also specified the particular smart contract
     * function to be called, with arguments
     * 
     * @param {Stub} stub 
     * @returns {Promise<ChaincodeReponse>} 
     * @memberof Chaincode
     */
    async Invoke(stub: Stub): Promise<ChaincodeReponse> {

        this.logger.info(`=========== Invoked Chaincode ${this.name} ===========`);
        this.logger.info(`Transaction ID: ${stub.getTxID()}`);
        this.logger.info(`Args: ${stub.getArgs().join(',')}`);

        let ret = stub.getFunctionAndParameters();

        let method = this[ret.fcn];

        if (!method) {
            this.logger.error(`no function of name: ${ret.fcn} found`);

            throw new ChaincodeError(ERRORS.UNKNOWN_FUNCTION_ERROR, {
                'function': ret.fcn
            });
        }

        let parsedParameters;

        try {
            parsedParameters = this.parseParameters(ret.params);
        } catch (err) {
            throw new ChaincodeError(ERRORS.PARSING_PARAMETERS_ERROR, {
                'message': err.message
            });
        }

        try {

            let payload = await method.call(this, stub, this.getTransactionHelperFor(stub), parsedParameters);

            if (payload && !Buffer.isBuffer(payload)) {
                payload = Buffer.from(JSON.stringify(Transform.normalizePayload(payload)));
            }

            return shim.success(payload);

        } catch (err) {
            let error = err;

            const stacktrace = err.stack;

            if (!(err instanceof ChaincodeError)) {
                error = new ChaincodeError(ERRORS.UNKNOWN_ERROR, {
                    'message': err.message
                });
            }
            this.logger.error(stacktrace);
            this.logger.error(`Data of error ${err.message}: ${JSON.stringify(err.data)}`);

            return shim.error(error.serialized);
        }
    }

    /**
     * Try and parse params to json
     * 
     * @private
     * @param {string[]} params 
     * @returns {any[]} the parsed parameters
     * @memberof Chaincode
     */
    private parseParameters(params: string[]): any[] {
        const parsedParams: any[] = [];

        params.forEach((param) => {
            try {
                // try to parse ...
                parsedParams.push(JSON.parse(param));
            } catch (err) {
                // if it fails fall back to original param
                parsedParams.push(param);
            }
        });

        return parsedParams;
    }
}