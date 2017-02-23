"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseModel_1 = require("./BaseModel");
var Slide = (function (_super) {
    __extends(Slide, _super);
    function Slide() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Slide.prototype.getName = function () {
        return this.name;
    };
    Slide.prototype.setName = function (name) {
        this.name = name;
    };
    Slide.prototype.getPath = function () {
        return this.path;
    };
    Slide.prototype.setPath = function (path) {
        this.path = path;
    };
    Slide.prototype.getOrder = function () {
        return this.order;
    };
    Slide.prototype.setOrder = function (order) {
        this.order = order;
    };
    Slide.prototype.getType = function () {
        return this.type;
    };
    Slide.prototype.setType = function (type) {
        this.type = type;
    };
    return Slide;
}(BaseModel_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Slide;
