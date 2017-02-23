"use strict";
var UserRepository_1 = require("./UserRepository");
var AttendeeRepository_1 = require("./AttendeeRepository");
var BlacklistRepository_1 = require("./BlacklistRepository");
var CategoryRepository_1 = require("./CategoryRepository");
var ClassroomRepository_1 = require("./ClassroomRepository");
var LessonRepository_1 = require("./LessonRepository");
var SessionRepository_1 = require("./SessionRepository");
exports.repos = {
    userRepository: UserRepository_1.userRepository,
    attendeeRepository: AttendeeRepository_1.attendeeRepository,
    blacklistRepository: BlacklistRepository_1.blacklistRepository,
    categoryRepository: CategoryRepository_1.categoryRepository,
    classroomRepository: ClassroomRepository_1.classroomRepository,
    lessonRepository: LessonRepository_1.lessonRepository,
    sessionRepository: SessionRepository_1.sessionRepository,
};
