"use strict";
var express = require("express");
var params_1 = require("./configs/params");
var experss_1 = require("./configs/experss");
var rethink_1 = require("./configs/rethink");
var router_1 = require("./configs/router");
var express_web_api;
(function (express_web_api) {
    // Initialize db connection
    rethink_1.default().then(function () {
        console.log('DB initialized successfully.');
    }).catch(function (err) {
        console.log('DB failed to initialize', err);
    });
    // Initialize express and set port number
    var app = express();
    app = experss_1.default(app);
    // Handle GET for the root URL
    app.use(router_1.default);
    // Start the web app
    app.listen(params_1.default.APP_PORT, function () { return console.log("App listening on port " + params_1.default.APP_PORT); });
})(express_web_api || (express_web_api = {}));
