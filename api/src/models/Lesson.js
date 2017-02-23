"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseModel_1 = require("./BaseModel");
var Lesson = (function (_super) {
    __extends(Lesson, _super);
    function Lesson() {
        var _this = _super.call(this) || this;
        _this.slides = [];
        return _this;
    }
    Lesson.prototype.getTitle = function () {
        return this.title;
    };
    Lesson.prototype.setTitle = function (title) {
        this.title = title;
    };
    Lesson.prototype.getDescription = function () {
        return this.description;
    };
    Lesson.prototype.setDescription = function (description) {
        this.description = description;
    };
    Lesson.prototype.getSlides = function () {
        return this.slides;
    };
    Lesson.prototype.setSlides = function (slides) {
        this.slides = slides;
    };
    Lesson.prototype.addSlide = function (slide) {
        this.slides.push(slide);
    };
    Lesson.prototype.setCategory = function (category) {
        this.category = category;
    };
    Lesson.prototype.getCategory = function () {
        return this.category;
    };
    return Lesson;
}(BaseModel_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Lesson;
