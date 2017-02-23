"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseRepository_1 = require("./BaseRepository");
var ClassroomRepository = (function (_super) {
    __extends(ClassroomRepository, _super);
    function ClassroomRepository() {
        return _super.call(this, 'classrooms') || this;
    }
    return ClassroomRepository;
}(BaseRepository_1.default));
exports.ClassroomRepository = ClassroomRepository;
exports.classroomRepository = new ClassroomRepository();
