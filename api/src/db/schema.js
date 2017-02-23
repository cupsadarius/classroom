"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events_1 = require("events");
var r = require("rethinkdb");
var params_1 = require("../configs/params");
var DatabaseSchema = (function (_super) {
    __extends(DatabaseSchema, _super);
    function DatabaseSchema() {
        var _this = _super.call(this) || this;
        _this.tables = [];
        return _this;
    }
    DatabaseSchema.prototype.setConnection = function (connection) {
        this.connection = connection;
    };
    DatabaseSchema.prototype.addTable = function (name, options) {
        this.tables.push({ name: name, options: options });
    };
    DatabaseSchema.prototype.build = function () {
        var promises = [];
        for (var i = 0; i < this.tables.length; i++) {
            promises.push(this.buildTable(this.tables[i]));
        }
        return Promise.all(promises);
    };
    DatabaseSchema.prototype.buildTable = function (table) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            r.db(params_1.default.DB_NAME).tableList()
                .run(_this.connection, function (err, tableList) {
                if (err) {
                    return reject(err);
                }
                var tableExists = Boolean(tableList.filter(function (tableName) { return tableName === table.name; }).length);
                if (!tableExists) {
                    r.db(params_1.default.DB_NAME).tableCreate(table.name, table.options)
                        .run(_this.connection, function (err, result) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(result);
                    });
                }
                else {
                    resolve(tableExists);
                }
            });
        });
    };
    return DatabaseSchema;
}(events_1.EventEmitter));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DatabaseSchema;
