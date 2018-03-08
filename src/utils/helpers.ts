import { Logger, LoggerInstance, transports } from 'winston';
import { isArray } from 'util';

/**
 * helper functions
 */
export class Helpers {

    /**
     * Winston Logger with default level: debug
     *
     * @static
     * @param {string} name
     * @param {string} [level]
     * @returns {LoggerInstance}
     * @memberof Helpers
     */
    public static getLoggerInstance(name: string, level?: string): LoggerInstance {
        return new Logger({
            transports: [new transports.Console({
                level: level || 'debug',
                prettyPrint: true,
                handleExceptions: true,
                json: false,
                label: name,
                colorize: true,
            })],
            exitOnError: false,
        });
    };

    /**
     * Check number of args
     * accepts array of numbers
     *
     * @static
     * @param {string[]} args
     * @param {(number | number[])} amount
     * @memberof Helpers
     */
    public static checkArgs(args: string[], amount: number | number[]) {
        if (isArray(amount)) {
            if (!amount.filter(a => {
                    return args.length === a;
                }).length) {
                throw new Error(`Incorrect number of arguments. Expecting ${amount}`);
            }
        } else {
            if (args.length != amount) {
                throw new Error(`Incorrect number of arguments. Expecting ${amount}`);
            }
        }
    }
}