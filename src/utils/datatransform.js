"use strict";
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
var helpers_1 = require("./helpers");
/**
 * The Transform class is a helper to provide data transformation to and from the formats required by hyperledger fabric.
 */
var Transform = /** @class */ (function () {
    function Transform() {
    }
    /**
     * serialize payload
     *
     * @static
     * @param {*} value
     * @returns
     * @memberof Transform
     */
    Transform.serialize = function (value) {
        if (value instanceof Buffer) {
            return value;
        }
        else if (this.isDate(value) || this.isString(value)) {
            return Buffer.from(this.normalizePayload(value).toString());
        }
        return Buffer.from(JSON.stringify(this.normalizePayload(value)));
    };
    /**
     * parse string to object
     *
     * @static
     * @param {Buffer} buffer
     * @returns {(object | undefined)}
     * @memberof Transform
     */
    Transform.bufferToObject = function (buffer) {
        if (buffer == null) {
            return null;
        }
        if (Number(parseFloat(buffer.toString())) === buffer) {
            return buffer;
        }
        var bufferString = buffer.toString('utf8');
        if (bufferString.length <= 0) {
            return null;
        }
        try {
            return JSON.parse(bufferString);
        }
        catch (err) {
            this.logger.error('Error parsing buffer to JSON', bufferString);
            return bufferString;
        }
    };
    /**
     * bufferToDate
     *
     * @static
     * @param {Buffer} buffer
     * @returns {(Date | undefined)}
     * @memberof Transform
     */
    Transform.bufferToDate = function (buffer) {
        if (buffer == null) {
            return null;
        }
        var bufferString = buffer.toString();
        if (bufferString.length <= 0) {
            return null;
        }
        if (/\d+/g.test(bufferString)) {
            return new Date(parseInt(bufferString, 10));
        }
        return null;
    };
    Transform.bufferToString = function (buffer) {
        if (buffer == null) {
            return null;
        }
        return buffer.toString();
    };
    /**
     * Transform iterator to array of objects
     *
     * @param {'fabric-shim'.Iterators.CommonIterator} iterator
     * @returns {Promise<Array>}
     */
    Transform.iteratorToList = function (iterator) {
        return __awaiter(this, void 0, void 0, function () {
            var allResults, res, parsedItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        allResults = [];
                        _a.label = 1;
                    case 1:
                        if (!(res == null || !res.done)) return [3 /*break*/, 3];
                        return [4 /*yield*/, iterator.next()];
                    case 2:
                        res = _a.sent();
                        if (res.value && res.value.value.toString()) {
                            parsedItem = void 0;
                            try {
                                parsedItem = JSON.parse(res.value.value.toString('utf8'));
                            }
                            catch (err) {
                                parsedItem = res.value.value.toString('utf8');
                            }
                            allResults.push(parsedItem);
                        }
                        return [3 /*break*/, 1];
                    case 3: return [4 /*yield*/, iterator.close()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, allResults];
                }
            });
        });
    };
    /**
     * Transform iterator to array of objects
     *
     * @param {'fabric-shim'.Iterators.CommonIterator} iterator
     * @returns {Promise<Array>}
     */
    Transform.iteratorToKVList = function (iterator) {
        return __awaiter(this, void 0, void 0, function () {
            var allResults, res, parsedItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        allResults = [];
                        _a.label = 1;
                    case 1:
                        if (!(res == null || !res.done)) return [3 /*break*/, 3];
                        return [4 /*yield*/, iterator.next()];
                    case 2:
                        res = _a.sent();
                        if (res.value && res.value.value.toString()) {
                            parsedItem = { key: '', value: {} };
                            parsedItem.key = res.value.key;
                            try {
                                parsedItem.value = JSON.parse(res.value.value.toString('utf8'));
                            }
                            catch (err) {
                                parsedItem.value = res.value.value.toString('utf8');
                            }
                            allResults.push(parsedItem);
                        }
                        return [3 /*break*/, 1];
                    case 3: return [4 /*yield*/, iterator.close()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, allResults];
                }
            });
        });
    };
    /**
     * Transform iterator to array of objects
     *
     * @param {Iterators.HistoryQueryIterator} iterator
     * @returns {Promise<Array>}
     */
    Transform.iteratorToHistoryList = function (iterator) {
        return __awaiter(this, void 0, void 0, function () {
            var allResults, res, parsedItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        allResults = [];
                        _a.label = 1;
                    case 1:
                        if (!(res == null || !res.done)) return [3 /*break*/, 3];
                        return [4 /*yield*/, iterator.next()];
                    case 2:
                        res = _a.sent();
                        if (res.value && res.value.value.toString()) {
                            parsedItem = {
                                is_delete: false,
                                value: {},
                                timestamp: null,
                                tx_id: ''
                            };
                            try {
                                parsedItem.value = JSON.parse(res.value.value.toString('utf8'));
                            }
                            catch (err) {
                                parsedItem.value = res.value.value.toString('utf8');
                            }
                            parsedItem.is_delete = res.value.is_delete;
                            parsedItem.tx_id = res.value.tx_id;
                            parsedItem.timestamp = res.value.timestamp.getSeconds();
                            allResults.push(parsedItem);
                        }
                        return [3 /*break*/, 1];
                    case 3: return [4 /*yield*/, iterator.close()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, allResults];
                }
            });
        });
    };
    /**
     * normalizePayload
     *
     * @static
     * @param {*} value
     * @returns {*}
     * @memberof Transform
     */
    Transform.normalizePayload = function (value) {
        var _this = this;
        if (value === null) {
            return value;
        }
        else if (this.isDate(value)) {
            return value.getTime();
        }
        else if (this.isString(value)) {
            return value;
        }
        else if (Array.isArray(value)) {
            return value.map(function (v) { return _this.normalizePayload(v); });
        }
        else if (this.isObject(value)) {
            return Object.entries(value)
                .reduce(function (a, _a) {
                var key = _a[0], v = _a[1];
                a[key] = _this.normalizePayload(v);
                return a;
            }, {});
        }
        return value;
    };
    Transform.isDate = function (date) {
        return date && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date);
    };
    Transform.isString = function (data) {
        return data && (typeof data === 'string' || data instanceof String);
    };
    Transform.isObject = function (data) {
        return data !== null && typeof data === 'object';
    };
    Transform.logger = helpers_1.Helpers.getLoggerInstance('Transform', 'info');
    return Transform;
}());
exports.Transform = Transform;
