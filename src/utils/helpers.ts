import { Logger, LoggerInstance, transports } from 'winston';

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
     * Check number of arguments
     * try to cast object using yup
     * validate arguments against predefined types using yup
     * return validated object
     * 
     * @static
     * @template T 
     * @param {string[]} args 
     * @param {*} yupSchema 
     * @returns {Promise<T>} 
     * @memberof Helpers
     */
    public static checkArgs<T>(args: string[], yupSchema: any): Promise<T> {

        const keys = yupSchema._nodes;

        if (!keys || args.length != keys.length) {
            throw new Error(`Incorrect number of arguments. Expecting ${keys.length}`);
        }

        let objectToValidate: T = <T>{};

        keys.reverse().forEach((key: string, index: number) => {
            objectToValidate[key] = args[index];
        });

        yupSchema.cast(objectToValidate);

        return yupSchema.validate(objectToValidate).then((validatedObject: T) => {
            return validatedObject;
        }).catch((errors: any) => {
            throw new Error(errors);
        });
    }

}