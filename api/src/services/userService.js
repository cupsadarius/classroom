"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var User_1 = require("../models/User");
var db_1 = require("../db");
var ValidatorFactory_1 = require("../db/validators/ValidatorFactory");
var authService_1 = require("./authService");
var UserService = (function () {
    function UserService() {
        this.validator = ValidatorFactory_1.default.getValidator('User');
    }
    UserService.prototype.saveUser = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var repo, user, count, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        repo = this.getUserRepository();
                        user = repo.getMapper().hydrate(new User_1.default(), data);
                        if (!this.validator.isValid(user)) {
                            return [2 /*return*/, this.validator.getErrors(user)];
                        }
                        user.setSalt(authService_1.authService.createSalt());
                        user.setPassword(authService_1.authService.hashPassword(user.getPassword(), data.password));
                        return [4 /*yield*/, repo.count({ email: user.getEmail() })];
                    case 1:
                        count = _a.sent();
                        if (count) {
                            return [2 /*return*/, "An user with the " + user.getEmail() + " already exists in the database."];
                        }
                        return [4 /*yield*/, repo.insert(repo.getMapper().dehydrate(user))];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        e_1 = _a.sent();
                        return [2 /*return*/, e_1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.getUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getUserRepository().getAllUsers()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_2 = _a.sent();
                        return [2 /*return*/, e_2];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.getById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getUserRepository().getById(id)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_3 = _a.sent();
                        return [2 /*return*/, e_3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.getByEmail = function (email, stripSensitive) {
        if (stripSensitive === void 0) { stripSensitive = false; }
        return __awaiter(this, void 0, void 0, function () {
            var e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getUserRepository().getByEmail(email, stripSensitive)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_4 = _a.sent();
                        return [2 /*return*/, e_4];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.update = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var repo, user, updated, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        repo = this.getUserRepository();
                        return [4 /*yield*/, repo.getById(id)];
                    case 1:
                        user = _a.sent();
                        data.password = data.password ? authService_1.authService.hashPassword(user.getSalt(), data.password) : data.password;
                        user = repo.getMapper().hydrate(user, data);
                        if (!this.validator.isValid(user)) {
                            return [2 /*return*/, this.validator.getErrors(user)];
                        }
                        return [4 /*yield*/, repo.update({ id: id }, user)];
                    case 2:
                        updated = _a.sent();
                        if (updated) {
                            return [2 /*return*/, repo.getMapper().dehydrate(user).stripSensitiveInfo()];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_5 = _a.sent();
                        return [2 /*return*/, e_5];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getUserRepository().delete([id])];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_6 = _a.sent();
                        return [2 /*return*/, e_6];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.getUserRepository = function () {
        return db_1.db.getRepo('userRepository');
    };
    return UserService;
}());
exports.UserService = UserService;
exports.userService = new UserService();
