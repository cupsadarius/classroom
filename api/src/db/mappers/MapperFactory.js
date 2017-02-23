"use strict";
var UserMapper_1 = require("./UserMapper");
var AttendeeMapper_1 = require("./AttendeeMapper");
var CategoryMapper_1 = require("./CategoryMapper");
var LessonMapper_1 = require("./LessonMapper");
var SlideMapper_1 = require("./SlideMapper");
var MapperFactory = (function () {
    function MapperFactory() {
    }
    MapperFactory.prototype.getMapper = function (className) {
        switch (className) {
            case 'User': {
                return new UserMapper_1.default();
            }
            case 'Attendee': {
                return new AttendeeMapper_1.default();
            }
            case 'Category': {
                return new CategoryMapper_1.default();
            }
            case 'Lesson': {
                return new LessonMapper_1.default();
            }
            case 'Slide': {
                return new SlideMapper_1.default();
            }
            default: {
                console.log('No mappers found for the provided entity');
            }
        }
    };
    return MapperFactory;
}());
exports.MapperFactory = MapperFactory;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new MapperFactory();
