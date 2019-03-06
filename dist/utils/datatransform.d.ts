/// <reference types="node" />
import { Iterators } from 'fabric-shim';
import { KeyModificationItem, KV } from '../index';
import { LoggerInstance } from 'winston';
/**
 * The Transform class is a helper to provide data transformation to and from the formats required by hyperledger fabric.
 */
export declare class Transform {
    static logger: LoggerInstance;
    /**
     * serialize payload
     *
     * @static
     * @param {*} value
     * @returns
     * @memberof Transform
     */
    static serialize(value: any): Buffer;
    /**
     * parse string to object
     *
     * @static
     * @param {Buffer} buffer
     * @returns {(object | undefined)}
     * @memberof Transform
     */
    static bufferToObject(buffer: Buffer): object | string;
    /**
     * bufferToDate
     *
     * @static
     * @param {Buffer} buffer
     * @returns {(Date | undefined)}
     * @memberof Transform
     */
    static bufferToDate(buffer: Buffer): Date | undefined;
    static bufferToString(buffer: Buffer): string | undefined;
    /**
     * Transform iterator to array of objects
     *
     * @param {'fabric-shim'.Iterators.CommonIterator} iterator
     * @returns {Promise<Array>}
     */
    static iteratorToList(iterator: Iterators.CommonIterator): Promise<any[]>;
    /**
     * Transform iterator to array of objects
     *
     * @param {'fabric-shim'.Iterators.CommonIterator} iterator
     * @returns {Promise<Array>}
     */
    static iteratorToKVList(iterator: Iterators.CommonIterator): Promise<KV[]>;
    /**
     * Transform iterator to array of objects
     *
     * @param {Iterators.HistoryQueryIterator} iterator
     * @returns {Promise<Array>}
     */
    static iteratorToHistoryList(iterator: Iterators.HistoryQueryIterator): Promise<KeyModificationItem[]>;
    /**
     * normalizePayload
     *
     * @static
     * @param {*} value
     * @returns {*}
     * @memberof Transform
     */
    static normalizePayload(value: any): any;
    static isDate(date: any): boolean;
    static isString(data: any): boolean;
    static isObject(data: any): boolean;
}
