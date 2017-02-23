"use strict";
var express_1 = require("express");
var authenticated_1 = require("../middlewares/authenticated");
var authorizedWithRole_1 = require("../middlewares/authorizedWithRole");
var router = express_1.Router();
router.get('/', authenticated_1.authenticated, authorizedWithRole_1.authorizedWithRole('ROLE_TEACHER'), function (req, res) {
    res.json('');
});
router.post('/', authenticated_1.authenticated, authorizedWithRole_1.authorizedWithRole('ROLE_TEACHER'), function (req, res) {
    res.json('');
});
router.get('/:id', authenticated_1.authenticated, authorizedWithRole_1.authorizedWithRole('ROLE_TEACHER'), function (req, res) {
    res.json('');
});
router.put('/:id', authenticated_1.authenticated, authorizedWithRole_1.authorizedWithRole('ROLE_TEACHER'), function (req, res) {
    res.json('');
});
router.delete('/:id', authenticated_1.authenticated, authorizedWithRole_1.authorizedWithRole('ROLE_TEACHER'), function (req, res) {
    res.json('');
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;
