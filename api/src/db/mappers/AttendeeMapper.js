"use strict";
var UserMapping_1 = require("./mappings/UserMapping");
var UserMapper = (function () {
    function UserMapper() {
    }
    UserMapper.prototype.hydrate = function (attendee, data) {
        if (data.id || attendee.getId()) {
            attendee.setId(data.id || attendee.getId());
        }
        attendee.setFirstName(data.firstName || attendee.getFirstName());
        attendee.setLastName(data.lastName || attendee.getLastName());
        attendee.setEmail(data.email || attendee.getEmail());
        attendee.setPhoneNumber(data.phoneNumber || attendee.getPhoneNumber());
        attendee.setPassword(data.password || attendee.getPassword());
        attendee.setSalt(data.salt || attendee.getSalt());
        attendee.setRoles(data.roles || attendee.getRoles());
        return attendee;
    };
    UserMapper.prototype.dehydrate = function (attendee) {
        var mapping = new UserMapping_1.default();
        mapping.id = attendee.getId();
        mapping.firstName = attendee.getFirstName();
        mapping.lastName = attendee.getLastName();
        mapping.email = attendee.getEmail();
        mapping.phoneNumber = attendee.getPhoneNumber();
        mapping.password = attendee.getPassword();
        mapping.salt = attendee.getSalt();
        mapping.roles = attendee.getRoles();
        return mapping;
    };
    return UserMapper;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserMapper;
