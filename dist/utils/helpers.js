"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = require("winston");
var ObjectValidationError_1 = require("./errors/ObjectValidationError");
var ChaincodeError_1 = require("./errors/ChaincodeError");
/**
 * helper functions
 */
var Helpers = /** @class */ (function () {
    function Helpers() {
    }
    /**
     * Winston Logger with default level: debug
     *
     * @static
     * @param {string} name
     * @param {string} [level]
     * @returns {LoggerInstance}
     * @memberof Helpers
     */
    Helpers.getLoggerInstance = function (name, level) {
        return new winston_1.Logger({
            transports: [new winston_1.transports.Console({
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
    Helpers.checkArgs = function (object, yupSchema) {
        if (!object || !yupSchema) {
            return Promise.reject(new ChaincodeError_1.ChaincodeError("CheckArgs requires an object and schema", 400));
        }
        return yupSchema.validate(object)
            .then(function (validatedObject) {
            return validatedObject;
        })
            .catch(function (error) {
            throw new ObjectValidationError_1.ObjectValidationError(error);
        });
    };
    return Helpers;
}());
exports.Helpers = Helpers;
//# sourceMappingURL=helpers.js.map