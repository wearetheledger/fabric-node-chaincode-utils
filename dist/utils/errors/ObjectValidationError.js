"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ChaincodeError_1 = require("./ChaincodeError");
/**
 * ObjectValidationError
 */
var ObjectValidationError = /** @class */ (function (_super) {
    __extends(ObjectValidationError, _super);
    function ObjectValidationError(error) {
        var _this = 
        // Calling parent constructor of base Error class.
        _super.call(this, error.message, 400) || this;
        _this.errors = error.errors;
        _this.params = error.params;
        _this.path = error.path;
        _this.value = error.value;
        _this.inner = error.inner;
        _this.type = error.type;
        return _this;
    }
    return ObjectValidationError;
}(ChaincodeError_1.ChaincodeError));
exports.ObjectValidationError = ObjectValidationError;
//# sourceMappingURL=ObjectValidationError.js.map