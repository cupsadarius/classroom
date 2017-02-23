"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseModel_1 = require("./BaseModel");
var Category = (function (_super) {
    __extends(Category, _super);
    function Category() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Category.prototype.setName = function (name) {
        this.name = name;
    };
    Category.prototype.getName = function () {
        return this.name;
    };
    Category.prototype.setDescription = function (description) {
        this.description = description;
    };
    Category.prototype.getDescription = function () {
        return this.description;
    };
    return Category;
}(BaseModel_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Category;
