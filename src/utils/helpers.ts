import { Logger, LoggerInstance, transports } from 'winston';
import { ObjectValidationError } from './errors/ObjectValidationError';
import { ChaincodeError } from './errors/ChaincodeError';

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
    }

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
    public static checkArgs<T>(object: Object, yupSchema: any): Promise<T> {

        if (!object || !yupSchema) {
            return Promise.reject(new ChaincodeError(`CheckArgs requires an object and schema`, 400));
        }

        return yupSchema.validate(object)
            .then((validatedObject: T) => {
                return validatedObject;
            })
            .catch((error: any) => {
                throw new ObjectValidationError(error);
            });
    }

}
