"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var shim = require("fabric-shim");
var helpers_1 = require("./utils/helpers");
var StubHelper_1 = require("./StubHelper");
var datatransform_1 = require("./utils/datatransform");
var ChaincodeError_1 = require("./utils/errors/ChaincodeError");
var InternalServerError_1 = require("./utils/errors/InternalServerError");
var serialize = require('serialize-error');
/**
 * The Chaincode class is a base class containing handlers for the `Invoke()` and `Init()` function which are required
 * by `fabric-shim`. The `Init()` function can be overwritten by just implementing it in your Chaincode implementation
 * class.
 */
var Chaincode = /** @class */ (function () {
    function Chaincode(logLevel) {
        this.logger = helpers_1.Helpers.getLoggerInstance(this.name, logLevel);
    }
    Object.defineProperty(Chaincode.prototype, "name", {
        /**
         * the name of the current chaincode.
         *
         * @readonly
         * @type {string}
         * @memberof Chaincode
         */
        get: function () {
            return this.constructor.name;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * The Init method is called when the Smart Contract is instantiated by the blockchain network
     * Best practice is to have any Ledger initialization in separate function -- see initLedger()
     *
     * @param {ChaincodeStub} stub
     * @returns {Promise<ChaincodeResponse>}
     * @memberof Chaincode
     */
    Chaincode.prototype.Init = function (stub) {
        return __awaiter(this, void 0, void 0, function () {
            var ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.info("=========== Instantiated " + this.name + " chaincode ===========");
                        this.logger.info("Transaction ID: " + stub.getTxID());
                        this.logger.info("Args: " + stub.getArgs().join(','));
                        ret = stub.getFunctionAndParameters();
                        return [4 /*yield*/, this.executeMethod('init', ret.params, stub, true)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * The Invoke method is called as a result of an application request to run the Smart Contract.
     * The calling application program has also specified the particular smart contract
     * function to be called, with arguments
     *
     * @param {ChaincodeStub} stub
     * @returns {Promise<ChaincodeResponse>}
     * @memberof Chaincode
     */
    Chaincode.prototype.Invoke = function (stub) {
        return __awaiter(this, void 0, void 0, function () {
            var ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.info("=========== Invoked Chaincode " + this.name + " ===========");
                        this.logger.info("Transaction ID: " + stub.getTxID());
                        this.logger.info("Args: " + stub.getArgs().join(','));
                        ret = stub.getFunctionAndParameters();
                        return [4 /*yield*/, this.executeMethod(ret.fcn, ret.params, stub)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Handle custom method execution
     *
     * @param {string} fcn
     * @param {string[]} params
     * @param stub
     * @param {boolean} silent
     * @returns {Promise<any>}
     */
    Chaincode.prototype.executeMethod = function (fcn, params, stub, silent) {
        if (silent === void 0) { silent = false; }
        return __awaiter(this, void 0, void 0, function () {
            var method, payload, err_1, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        method = this[fcn];
                        if (!method) {
                            if (!silent) {
                                this.logger.error("no function of name: " + fcn + " found");
                                return [2 /*return*/, shim.error(serialize(new ChaincodeError_1.ChaincodeError("no function of name: " + fcn + " found", 400)))];
                            }
                            else {
                                return [2 /*return*/, shim.success()];
                            }
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        this.logger.debug("============= START : " + fcn + " ===========");
                        return [4 /*yield*/, method.call(this, new StubHelper_1.StubHelper(stub), params)];
                    case 2:
                        payload = _a.sent();
                        if ((payload !== undefined && payload !== null) && !Buffer.isBuffer(payload)) {
                            payload = Buffer.from(JSON.stringify(datatransform_1.Transform.normalizePayload(payload)));
                        }
                        this.logger.debug("============= END : " + fcn + " ===========");
                        return [2 /*return*/, shim.success(payload)];
                    case 3:
                        err_1 = _a.sent();
                        error = err_1;
                        this.logger.error(err_1);
                        if (error.name !== 'ChaincodeError') {
                            error = new InternalServerError_1.InternalServerError(error.message);
                        }
                        delete error.stack;
                        return [2 /*return*/, shim.error(Buffer.from(JSON.stringify(serialize(error))))];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Chaincode;
}());
exports.Chaincode = Chaincode;
//# sourceMappingURL=Chaincode.js.map