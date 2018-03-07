import { KV, Stub } from 'fabric-shim';
import { Helpers } from './utils/helpers';
import { Transform } from './utils/datatransform';
import * as _ from 'lodash';

export class TransactionHelper {

    constructor(private stub: Stub) {
        this.stub = stub;
    }

    /**
     * Query the state and return a list of results.
     *
     * @param {string | Object} query
     * @param keyValue - Should return a key value
     * @returns {Promise<any>}
     */
    async getQueryResultAsList(query: string | object, keyValue?: boolean): Promise<object[] | KV[]> {
        let queryString: string;

        if (_.isObject(query)) {
            queryString = JSON.stringify(query);
        } else {
            queryString = <string>query;
        }

        Helpers.log(`Query: ${queryString}`);

        const iterator = await this.stub.getQueryResult(queryString);

        if (keyValue) {
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
     */
    async getStateByRangeAsList(startKey: string, endKey: string): Promise<KV[]> {

        Helpers.log(`StartKey: ${startKey} - EndKey: ${endKey}`);

        const iterator = await this.stub.getStateByRange(startKey, endKey);

        return Transform.iteratorToList(iterator);
    }

    /**
     *   Deletes all objects returned by the query
     *   @param {Object} query the query
     */
    async deleteAllReturnedByQuery(query: string | object): Promise<KV[]> {

        const allResults = <KV[]>(await this.getQueryResultAsList(query, true));

        return Promise.all(allResults.map((record: KV) => this.stub.deleteState(record.key)));
    }

    /**
     * Serializes the value and store it on the state db.
     *
     * @param {String} key
     * @param value
     */
    async putState(key: string, value: any): Promise<any> {
        return this.stub.putState(key, Transform.serialize(value));
    }

    /**
     * @param {String} key
     *
     * @return the state for the given key parsed as an Object
     */
    async getStateAsObject(key: string): Promise<Object> {

        const valueAsBytes = await this.stub.getState(key);

        if (!valueAsBytes || valueAsBytes.toString().length <= 0) {
            return null;
        }

        return Transform.bufferToObject(valueAsBytes);
    }

    /**
     * @param {String} key
     *
     * @return the state for the given key parsed as a String
     */
    async getStateAsString(key: string) {

        const rawValue = await this.stub.getState(key);

        return Transform.bufferToString(rawValue);
    }

    /**
     * @param {String} key
     *
     * @return the state for the given key parsed as a Date
     */
    async getStateAsDate(key: string) {

        const rawValue = await this.stub.getState(key);

        return Transform.bufferToDate(rawValue);
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

        Helpers.log(`Setting Event ${name} with payload ${JSON.stringify(payload)}`);

        this.stub.setEvent(name, bufferedPayload);
    }

}