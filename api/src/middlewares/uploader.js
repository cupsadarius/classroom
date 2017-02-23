"use strict";
var multer = require("multer");
var path = require("path");
exports.upload = multer({
    dest: path.join(__dirname, '../../public/uploads'),
    limits: {
        fileSize: 10000000,
        files: 20,
    }
});
