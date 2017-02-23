"use strict";
var ErrorResponse_1 = require("../helpers/ErrorResponse");
exports.authorizedWithRole = function (role) {
    return function (req, res, next) {
        if (req.user && req.user.roles.indexOf(role) > -1) {
            next();
        }
        else {
            res.status(403);
            res.json(new ErrorResponse_1.default('Unauthorized access.'));
        }
    };
};
