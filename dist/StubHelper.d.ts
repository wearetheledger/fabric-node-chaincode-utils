/// <reference types="@theledger/fabric-shim-crypto-types" />
import { ClientIdentity, ChaincodeStub } from 'fabric-shim';
import { KV } from './index';
import { GetQueryResultAsListOptions } from './models/GetQueryResultAsListOptions';
import { DeleteAllByQueryOptions } from './models/DeleteAllByQueryOptions';
import { GetStateByRangeAsListOptions } from './models/GetStateByRangeAsListOptions';
import { PutStateOptions } from './models/PutStateOptions';
import { GetStateOptions } from './models/GetStateOptions';
import ShimCrypto = require('fabric-shim-crypto');
/**
 *  The StubHelper is a wrapper around the `fabric-shim` ChaincodeStub. Its a helper to automatically serialize and
 *  deserialize data being saved/retreived.
 */
export declare class StubHelper {
    private readonly stub;
    private logger;
    /**
     * @param {ChaincodeStub} stub
     */
    constructor(stub: ChaincodeStub);
    /**
     * @returns {ChaincodeStub}
     */
    getStub(): ChaincodeStub;
    /**
     * Return Fabric crypto library for signing and encryption
     *
     * @returns {ShimCrypto}
     */
    getChaincodeCrypto(): ShimCrypto;
    /**
     * Return the Client Identity
     *
     * @returns {ClientIdentity}
     */
    getClientIdentity(): ClientIdentity;
    /**
     * Generate deterministic UUID
     *
     * @param {string} name
     * @returns {any}
     */
    generateUUID(name: string): string;
    /**
     * Query the state and return a list of results.
     *
     * @param {string | Object} query - CouchDB query
     * @param {GetQueryResultAsListOptions} options
     * @returns {Promise<any>}
     */
    getQueryResultAsList(query: string | object, options?: GetQueryResultAsListOptions): Promise<object[] | KV[]>;
    /**
     * Query the state by range
     *
     * @returns {Promise<any>}
     * @param startKey
     * @param endKey
     * @param options
     */
    getStateByRangeAsList(startKey: string, endKey: string, options?: GetStateByRangeAsListOptions): Promise<KV[]>;
    /**
     * Fetch a history for a specific key and return a list of results.
     *
     * @returns {Promise<any>}
     * @param key
     */
    getHistoryForKeyAsList(key: string): Promise<object[]>;
    /**
     *   Deletes all objects returned by the query
     *   @param {Object} query the query
     * @param options
     */
    deleteAllByQuery(query: string | object, options?: DeleteAllByQueryOptions): Promise<void[]>;
    /**
     * Serializes the value and store it on the state db.
     *
     * @param {String} key
     * @param value
     * @param options
     */
    putState(key: string, value: any, options?: PutStateOptions): Promise<any>;
    /**
     * @param {String} key
     *
     * @param options
     * @return the state for the given key parsed as an Object
     */
    getStateAsObject(key: string, options?: GetStateOptions): Promise<Object>;
    /**
     * @param {String} key
     *
     * @param options
     * @return the state for the given key parsed as a String
     */
    getStateAsString(key: string, options?: GetStateOptions): Promise<string>;
    /**
     * @param {String} key
     *
     * @param options
     * @return the state for the given key parsed as a Date
     */
    getStateAsDate(key: string, options?: GetStateOptions): Promise<Date>;
    /**
     * @return the Transaction date as a Javascript Date Object.
     */
    getTxDate(): Date;
    /**
     * Publish an event to the Blockchain
     *
     * @param {String} name
     * @param {Object} payload
     */
    setEvent(name: string, payload: object): void;
}
