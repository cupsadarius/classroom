"use strict";
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var path = require("path");
var cors_1 = require("../middlewares/cors");
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (app) {
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use('/public', express.static(path.join(__dirname, '../../public')));
    app.use(cors_1.cors);
    return app;
};
