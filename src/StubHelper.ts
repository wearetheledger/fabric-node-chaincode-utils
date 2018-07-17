import { ClientIdentity, Stub } from 'fabric-shim';
import { Helpers } from './utils/helpers';
import { Transform } from './utils/datatransform';
import * as _ from 'lodash';
import { LoggerInstance } from 'winston';
import { KV } from './index';
import ShimCrypto = require('fabric-shim-crypto');

const aguid = require('aguid');

/**
 *  The StubHelper is a wrapper around the `fabric-shim` Stub. Its a helper to automatically serialize and
 *  deserialize data being saved/retreived.
 */
export class StubHelper {

    private logger: LoggerInstance;

    /**
     * @param {Stub} stub
     */
    constructor(private readonly stub: Stub) {
        this.stub = stub;
        this.logger = Helpers.getLoggerInstance('StubHelper');
    }

    /**
     * @returns {Stub}
     */
    getStub(): Stub {
        return this.stub;
    }

    /**
     * Return Fabric crypto library for signing and encryption
     *
     * @returns {ShimCrypto}
     */
    getChaincodeCrypto(): ShimCrypto {
        return new ShimCrypto(this.stub);
    }

    /**
     * Return the Client Identity
     *
     * @returns {ClientIdentity}
     */
    getClientIdentity(): ClientIdentity {
        return new ClientIdentity(this.stub);
    }

    /**
     * Generate deterministic UUID
     *
     * @param {string} name
     * @returns {any}
     */
    generateUUID(name: string): string {
        const txId = this.stub.getTxID();
        const txTimestamp = this.getTxDate().getTime();

        return aguid(`${name}_${txId}_${txTimestamp}`);
    }

    /**
     * Query the state and return a list of results.
     *
     * @param {string | Object} query - CouchDB query
     * @param {GetQueryResultAsListOptions} options
     * @returns {Promise<any>}
     */
    async getQueryResultAsList(query: string | object, options: GetQueryResultAsListOptions = {}): Promise<object[] | KV[]> {
        let queryString: string;

        if (_.isObject(query)) {
            queryString = JSON.stringify(query);
        } else {
            queryString = <string>query;
        }

        this.logger.debug(`Query: ${queryString}`);

        let iterator;

        if (options.privateCollection) {
            iterator = await this.stub.getPrivateDataQueryResult(options.privateCollection, queryString);
        } else {
            iterator = await this.stub.getQueryResult(queryString);
        }

        if (options.keyValue) {
            return Transform.iteratorToKVList(iterator);
        }

        return Transform.iteratorToList(iterator);
    }

    /**
     * Query the state by range
     *
     * @returns {Promise<any>}
     * @param startKey
     * @param endKey
     * @param options
     */
    async getStateByRangeAsList(startKey: string, endKey: string, options: GetStateByRangeAsListOptions = {}): Promise<KV[]> {

        this.logger.debug(`StartKey: ${startKey} - EndKey: ${endKey}`);

        let iterator;

        if (options.privateCollection) {
            iterator = await this.stub.getPrivateDataByRange(options.privateCollection, startKey, endKey);
        } else {
            iterator = await this.stub.getStateByRange(startKey, endKey);
        }

        return Transform.iteratorToList(iterator);
    }

    /**
     * Fetch a history for a specific key and return a list of results.
     *
     * @returns {Promise<any>}
     * @param key
     */
    async getHistoryForKeyAsList(key: string): Promise<object[]> {

        this.logger.debug(`History for key: ${key}`);

        const iterator = await this.stub.getHistoryForKey(key);

        return Transform.iteratorToHistoryList(iterator);
    }

    /**
     *   Deletes all objects returned by the query
     *   @param {Object} query the query
     * @param options
     */
    async deleteAllByQuery(query: string | object, options: DeleteAllByQueryOptions = {}): Promise<KV[]> {

        const allResults = <KV[]>(await this.getQueryResultAsList(query, {keyValue: true, ...options}));

        return Promise.all(allResults.map((record: KV) => this.stub.deleteState(record.key)));
    }

    /**
     * Serializes the value and store it on the state db.
     *
     * @param {String} key
     * @param value
     * @param options
     */
    async putState(key: string, value: any, options: PutStateOptions = {}): Promise<any> {

        if (options.privateCollection) {
            return this.stub.putPrivateData(options.privateCollection, key, Transform.serialize(value));
        }

        return this.stub.putState(key, Transform.serialize(value));
    }

    /**
     * @param {String} key
     *
     * @param options
     * @return the state for the given key parsed as an Object
     */
    async getStateAsObject(key: string, options: GetStateOptions = {}): Promise<Object> {

        let valueAsBytes;

        if (options.privateCollection) {
            valueAsBytes = await this.stub.getPrivateData(options.privateCollection, key);
        } else {
            valueAsBytes = await this.stub.getState(key);
        }

        if ((valueAsBytes === undefined || valueAsBytes === null) || valueAsBytes.toString().length <= 0) {
            return null;
        }

        return Transform.bufferToObject(valueAsBytes);
    }

    /**
     * @param {String} key
     *
     * @param options
     * @return the state for the given key parsed as a String
     */
    async getStateAsString(key: string, options: GetStateOptions = {}): Promise<string> {

        let valueAsBytes;

        if (options.privateCollection) {
            valueAsBytes = await this.stub.getPrivateData(options.privateCollection, key);
        } else {
            valueAsBytes = await this.stub.getState(key);
        }

        if ((valueAsBytes === undefined || valueAsBytes === null) || valueAsBytes.toString().length <= 0) {
            return null;
        }

        return Transform.bufferToString(valueAsBytes);
    }

    /**
     * @param {String} key
     *
     * @param options
     * @return the state for the given key parsed as a Date
     */
    async getStateAsDate(key: string, options: GetStateOptions = {}): Promise<Date> {

        let valueAsBytes;

        if (options.privateCollection) {
            valueAsBytes = await this.stub.getPrivateData(options.privateCollection, key);
        } else {
            valueAsBytes = await this.stub.getState(key);
        }

        if ((valueAsBytes === undefined || valueAsBytes === null) || valueAsBytes.toString().length <= 0) {
            return null;
        }

        return Transform.bufferToDate(valueAsBytes);
    }

    /**
     * @return the Transaction date as a Javascript Date Object.
     */
    getTxDate(): Date {
        return this.stub.getTxTimestamp().toDate();
    }

    /**
     * Publish an event to the Blockchain
     *
     * @param {String} name
     * @param {Object} payload
     */
    setEvent(name: string, payload: object) {
        let bufferedPayload;

        if (Buffer.isBuffer(payload)) {
            bufferedPayload = payload;
        } else {
            bufferedPayload = Buffer.from(JSON.stringify(payload));
        }

        this.logger.debug(`Setting Event ${name} with payload ${JSON.stringify(payload)}`);

        this.stub.setEvent(name, bufferedPayload);
    }

}
