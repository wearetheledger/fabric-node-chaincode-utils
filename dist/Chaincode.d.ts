import { ChaincodeInterface, ChaincodeResponse, ChaincodeStub } from 'fabric-shim';
import { LoggerInstance } from 'winston';
/**
 * The Chaincode class is a base class containing handlers for the `Invoke()` and `Init()` function which are required
 * by `fabric-shim`. The `Init()` function can be overwritten by just implementing it in your Chaincode implementation
 * class.
 */
export declare class Chaincode implements ChaincodeInterface {
    logger: LoggerInstance;
    constructor(logLevel?: string);
    /**
     * the name of the current chaincode.
     *
     * @readonly
     * @type {string}
     * @memberof Chaincode
     */
    readonly name: string;
    /**
     * The Init method is called when the Smart Contract is instantiated by the blockchain network
     * Best practice is to have any Ledger initialization in separate function -- see initLedger()
     *
     * @param {ChaincodeStub} stub
     * @returns {Promise<ChaincodeResponse>}
     * @memberof Chaincode
     */
    Init(stub: ChaincodeStub): Promise<ChaincodeResponse>;
    /**
     * The Invoke method is called as a result of an application request to run the Smart Contract.
     * The calling application program has also specified the particular smart contract
     * function to be called, with arguments
     *
     * @param {ChaincodeStub} stub
     * @returns {Promise<ChaincodeResponse>}
     * @memberof Chaincode
     */
    Invoke(stub: ChaincodeStub): Promise<ChaincodeResponse>;
    /**
     * Handle custom method execution
     *
     * @param {string} fcn
     * @param {string[]} params
     * @param stub
     * @param {boolean} silent
     * @returns {Promise<any>}
     */
    private executeMethod;
}
