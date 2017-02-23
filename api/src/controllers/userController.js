"use strict";
/// <reference path="../../typings/tsd.d.ts"/>
var express_1 = require("express");
var userService_1 = require("../services/userService");
var SuccessResponse_1 = require("../helpers/SuccessResponse");
var ErrorResponse_1 = require("../helpers/ErrorResponse");
var authenticated_1 = require("../middlewares/authenticated");
var authorizedWithRole_1 = require("../middlewares/authorizedWithRole");
var router = express_1.Router();
/* GET home page. */
router.get('/', authenticated_1.authenticated, authorizedWithRole_1.authorizedWithRole('ROLE_ADMIN'), function (req, res) {
    userService_1.userService.getUsers().then(function (users) {
        res.status(200);
        res.json(new SuccessResponse_1.default(users));
    }, function (error) {
        res.status(400);
        res.json(new ErrorResponse_1.default(error));
    });
});
router.post('/', authenticated_1.authenticated, authorizedWithRole_1.authorizedWithRole('ROLE_ADMIN'), function (req, res) {
    userService_1.userService.saveUser(req.body).then(function (userId) {
        res.status(201);
        res.json(new SuccessResponse_1.default(userId));
    }, function (error) {
        res.status(400);
        res.json(new ErrorResponse_1.default(error));
    });
});
router.get('/:id', authenticated_1.authenticated, authorizedWithRole_1.authorizedWithRole('ROLE_ADMIN'), function (req, res) {
    userService_1.userService.getById(req.params.id).then(function (user) {
        res.status(200);
        res.json(new SuccessResponse_1.default(user));
    }, function (error) {
        res.status(400);
        res.json(new ErrorResponse_1.default(error));
    });
});
router.put('/:id', authenticated_1.authenticated, authorizedWithRole_1.authorizedWithRole('ROLE_ADMIN'), function (req, res) {
    userService_1.userService.update(req.params.id, req.body).then(function (user) {
        res.status(200);
        res.json(new SuccessResponse_1.default(user));
    }, function (error) {
        res.status(400);
        res.json(new ErrorResponse_1.default(error));
    });
});
router.delete('/:id', authenticated_1.authenticated, authorizedWithRole_1.authorizedWithRole('ROLE_ADMIN'), function (req, res) {
    userService_1.userService.delete(req.params.id).then(function () {
        res.status(200);
        res.json(new SuccessResponse_1.default(''));
    }, function (error) {
        res.status(400);
        res.json(new ErrorResponse_1.default(error));
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;
