"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
exports.__esModule = true;
var fabric_shim_1 = require("fabric-shim");
var helpers_1 = require("./utils/helpers");
var datatransform_1 = require("./utils/datatransform");
var ShimCrypto = require("fabric-shim-crypto");
var aguid = require('aguid');
/**
 *  The StubHelper is a wrapper around the `fabric-shim` ChaincodeStub. Its a helper to automatically serialize and
 *  deserialize data being saved/retreived.
 */
var StubHelper = /** @class */ (function () {
    /**
     * @param {ChaincodeStub} stub
     */
    function StubHelper(stub) {
        this.stub = stub;
        this.stub = stub;
        this.logger = helpers_1.Helpers.getLoggerInstance('StubHelper');
    }
    /**
     * @returns {ChaincodeStub}
     */
    StubHelper.prototype.getStub = function () {
        return this.stub;
    };
    /**
     * Return Fabric crypto library for signing and encryption
     *
     * @returns {ShimCrypto}
     */
    StubHelper.prototype.getChaincodeCrypto = function () {
        return new ShimCrypto(this.stub);
    };
    /**
     * Return the Client Identity
     *
     * @returns {ClientIdentity}
     */
    StubHelper.prototype.getClientIdentity = function () {
        return new fabric_shim_1.ClientIdentity(this.stub);
    };
    /**
     * Generate deterministic UUID
     *
     * @param {string} name
     * @returns {any}
     */
    StubHelper.prototype.generateUUID = function (name) {
        var txId = this.stub.getTxID();
        var txTimestamp = this.getTxDate().getTime();
        return aguid(name + "_" + txId + "_" + txTimestamp);
    };
    /**
     * Query the state and return a list of results.
     *
     * @param {string | Object} query - CouchDB query
     * @param {GetQueryResultAsListOptions} options
     * @returns {Promise<any>}
     */
    StubHelper.prototype.getQueryResultAsList = function (query, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var queryString, iterator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (query && typeof query === 'object') {
                            queryString = JSON.stringify(query);
                        }
                        else {
                            queryString = query;
                        }
                        this.logger.debug("Query: " + queryString);
                        if (!options.privateCollection) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.stub.getPrivateDataQueryResult(options.privateCollection, queryString)];
                    case 1:
                        iterator = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.stub.getQueryResult(queryString)];
                    case 3:
                        iterator = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (options.keyValue) {
                            return [2 /*return*/, datatransform_1.Transform.iteratorToKVList(iterator)];
                        }
                        return [2 /*return*/, datatransform_1.Transform.iteratorToList(iterator)];
                }
            });
        });
    };
    /**
     * Query the state by range
     *
     * @returns {Promise<any>}
     * @param startKey
     * @param endKey
     * @param options
     */
    StubHelper.prototype.getStateByRangeAsList = function (startKey, endKey, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var iterator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug("StartKey: " + startKey + " - EndKey: " + endKey);
                        if (!options.privateCollection) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.stub.getPrivateDataByRange(options.privateCollection, startKey, endKey)];
                    case 1:
                        iterator = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.stub.getStateByRange(startKey, endKey)];
                    case 3:
                        iterator = _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, datatransform_1.Transform.iteratorToList(iterator)];
                }
            });
        });
    };
    /**
     * Fetch a history for a specific key and return a list of results.
     *
     * @returns {Promise<any>}
     * @param key
     */
    StubHelper.prototype.getHistoryForKeyAsList = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var iterator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug("History for key: " + key);
                        return [4 /*yield*/, this.stub.getHistoryForKey(key)];
                    case 1:
                        iterator = _a.sent();
                        return [2 /*return*/, datatransform_1.Transform.iteratorToHistoryList(iterator)];
                }
            });
        });
    };
    /**
     *   Deletes all objects returned by the query
     *   @param {Object} query the query
     * @param options
     */
    StubHelper.prototype.deleteAllByQuery = function (query, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var allResults;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getQueryResultAsList(query, __assign({ keyValue: true }, options))];
                    case 1:
                        allResults = (_a.sent());
                        return [2 /*return*/, Promise.all(allResults.map(function (record) {
                                if (options.privateCollection) {
                                    return _this.stub.deletePrivateData(options.privateCollection, record.key);
                                }
                                else {
                                    return _this.stub.deleteState(record.key);
                                }
                            }))];
                }
            });
        });
    };
    /**
     * Serializes the value and store it on the state db.
     *
     * @param {String} key
     * @param value
     * @param options
     */
    StubHelper.prototype.putState = function (key, value, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (options.privateCollection) {
                    return [2 /*return*/, this.stub.putPrivateData(options.privateCollection, key, datatransform_1.Transform.serialize(value))];
                }
                return [2 /*return*/, this.stub.putState(key, datatransform_1.Transform.serialize(value))];
            });
        });
    };
    /**
     * @param {String} key
     *
     * @param options
     * @return the state for the given key parsed as an Object
     */
    StubHelper.prototype.getStateAsObject = function (key, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var valueAsBytes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.privateCollection) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.stub.getPrivateData(options.privateCollection, key)];
                    case 1:
                        valueAsBytes = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.stub.getState(key)];
                    case 3:
                        valueAsBytes = _a.sent();
                        _a.label = 4;
                    case 4:
                        if ((valueAsBytes === undefined || valueAsBytes === null) || valueAsBytes.toString().length <= 0) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, datatransform_1.Transform.bufferToObject(valueAsBytes)];
                }
            });
        });
    };
    /**
     * @param {String} key
     *
     * @param options
     * @return the state for the given key parsed as a String
     */
    StubHelper.prototype.getStateAsString = function (key, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var valueAsBytes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.privateCollection) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.stub.getPrivateData(options.privateCollection, key)];
                    case 1:
                        valueAsBytes = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.stub.getState(key)];
                    case 3:
                        valueAsBytes = _a.sent();
                        _a.label = 4;
                    case 4:
                        if ((valueAsBytes === undefined || valueAsBytes === null) || valueAsBytes.toString().length <= 0) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, datatransform_1.Transform.bufferToString(valueAsBytes)];
                }
            });
        });
    };
    /**
     * @param {String} key
     *
     * @param options
     * @return the state for the given key parsed as a Date
     */
    StubHelper.prototype.getStateAsDate = function (key, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var valueAsBytes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.privateCollection) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.stub.getPrivateData(options.privateCollection, key)];
                    case 1:
                        valueAsBytes = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.stub.getState(key)];
                    case 3:
                        valueAsBytes = _a.sent();
                        _a.label = 4;
                    case 4:
                        if ((valueAsBytes === undefined || valueAsBytes === null) || valueAsBytes.toString().length <= 0) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, datatransform_1.Transform.bufferToDate(valueAsBytes)];
                }
            });
        });
    };
    /**
     * @return the Transaction date as a Javascript Date Object.
     */
    StubHelper.prototype.getTxDate = function () {
        return new Date(this.stub.getTxTimestamp().getSeconds() * 1000);
    };
    /**
     * Publish an event to the Blockchain
     *
     * @param {String} name
     * @param {Object} payload
     */
    StubHelper.prototype.setEvent = function (name, payload) {
        var bufferedPayload;
        if (Buffer.isBuffer(payload)) {
            bufferedPayload = payload;
        }
        else {
            bufferedPayload = Buffer.from(JSON.stringify(payload));
        }
        this.logger.debug("Setting Event " + name + " with payload " + JSON.stringify(payload));
        this.stub.setEvent(name, bufferedPayload);
    };
    return StubHelper;
}());
exports.StubHelper = StubHelper;
