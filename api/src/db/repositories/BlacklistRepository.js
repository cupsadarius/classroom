"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseRepository_1 = require("./BaseRepository");
var BlacklistRepository = (function (_super) {
    __extends(BlacklistRepository, _super);
    function BlacklistRepository() {
        return _super.call(this, 'blacklist') || this;
    }
    return BlacklistRepository;
}(BaseRepository_1.default));
exports.BlacklistRepository = BlacklistRepository;
exports.blacklistRepository = new BlacklistRepository();
