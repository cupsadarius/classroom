"use strict";
var ErrorResponse = (function () {
    function ErrorResponse(data) {
        this.status = false;
        this.data = data;
    }
    return ErrorResponse;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ErrorResponse;
