"use strict";
var express_1 = require("express");
var router = express_1.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({ message: 'Api entrypoint' });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;
