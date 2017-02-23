"use strict";
var BaseModel = (function () {
    function BaseModel() {
    }
    BaseModel.prototype.getId = function () {
        return this.id;
    };
    BaseModel.prototype.setId = function (id) {
        this.id = id;
    };
    return BaseModel;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BaseModel;
