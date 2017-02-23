"use strict";
var UserMapping_1 = require("./mappings/UserMapping");
var UserMapper = (function () {
    function UserMapper() {
    }
    UserMapper.prototype.hydrate = function (user, data) {
        if (data.id || user.getId()) {
            user.setId(data.id || user.getId());
        }
        user.setFirstName(data.firstName || user.getFirstName());
        user.setLastName(data.lastName || user.getLastName());
        user.setEmail(data.email || user.getEmail());
        user.setPhoneNumber(data.phoneNumber || user.getPhoneNumber());
        user.setPassword(data.password || user.getPassword());
        user.setSalt(data.salt || user.getSalt());
        user.setRoles(data.roles || user.getRoles());
        return user;
    };
    UserMapper.prototype.dehydrate = function (user) {
        var mapping = new UserMapping_1.default();
        mapping.id = user.getId();
        mapping.firstName = user.getFirstName();
        mapping.lastName = user.getLastName();
        mapping.email = user.getEmail();
        mapping.phoneNumber = user.getPhoneNumber();
        mapping.password = user.getPassword();
        mapping.salt = user.getSalt();
        mapping.roles = user.getRoles();
        return mapping;
    };
    return UserMapper;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserMapper;
