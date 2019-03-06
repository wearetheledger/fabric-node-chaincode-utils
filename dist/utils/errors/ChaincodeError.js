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
/**
 * ChaincodeError
 */
var ChaincodeError = /** @class */ (function (_super) {
    __extends(ChaincodeError, _super);
    function ChaincodeError(message, status) {
        var _this = 
        // Calling parent constructor of base Error class.
        _super.call(this, message) || this;
        // Saving class name in the property of our custom error as a shortcut.
        _this.name = _this.constructor.name;
        // Capturing stack trace, excluding constructor call from it.
        Error.captureStackTrace(_this, _this.constructor);
        // You can use any additional properties you want.
        // I'm going to use preferred HTTP status for this error types.
        // `500` is the default value if not specified.
        _this.status = status || 500;
        return _this;
    }
    return ChaincodeError;
}(Error));
exports.ChaincodeError = ChaincodeError;
//# sourceMappingURL=ChaincodeError.js.map