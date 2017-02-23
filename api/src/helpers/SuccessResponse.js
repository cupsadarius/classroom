"use strict";
var SuccessResponse = (function () {
    function SuccessResponse(data) {
        this.status = true;
        this.data = data;
    }
    return SuccessResponse;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SuccessResponse;
