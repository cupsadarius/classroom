"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseRepository_1 = require("./BaseRepository");
var SessionRepository = (function (_super) {
    __extends(SessionRepository, _super);
    function SessionRepository() {
        return _super.call(this, 'sessions') || this;
    }
    return SessionRepository;
}(BaseRepository_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SessionRepository;
exports.sessionRepository = new SessionRepository();
