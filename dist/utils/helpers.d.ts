import { LoggerInstance } from 'winston';
/**
 * helper functions
 */
export declare class Helpers {
    /**
     * Winston Logger with default level: debug
     *
     * @static
     * @param {string} name
     * @param {string} [level]
     * @returns {LoggerInstance}
     * @memberof Helpers
     */
    static getLoggerInstance(name: string, level?: string): LoggerInstance;
    /**
     * Check first argument
     * try to cast object using yup
     * validate arguments against predefined types using yup
     * return validated object
     *
     * @static
     * @template T
     * @param object
     * @param {*} yupSchema
     * @returns {Promise<T>}
     * @memberof Helpers
     */
    static checkArgs<T>(object: Object, yupSchema: any): Promise<T>;
}
