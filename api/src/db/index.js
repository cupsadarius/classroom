"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events_1 = require("events");
var r = require("rethinkdb");
var repositories_1 = require("./repositories");
var Database = (function (_super) {
    __extends(Database, _super);
    function Database() {
        var _this = _super.call(this) || this;
        _this.connection = null;
        _this.schema = null;
        _this.options = {};
        _this.on('connected', _this.onConnected.bind(_this));
        _this.on('db_exists', _this.onDbExists.bind(_this));
        _this.on('schema_exists', _this.onSchemaExists.bind(_this));
        return _this;
    }
    Database.prototype.setSchema = function (schema) {
        this.schema = schema;
    };
    Database.prototype.connect = function (options) {
        var _this = this;
        this.options = options;
        r.connect(options, function (err, conn) {
            if (err) {
                _this.emit('error', err, 'connection');
            }
            _this.connection = conn;
            _this.emit('connected', conn);
        });
    };
    Database.prototype.getRepo = function (name) {
        var repo = repositories_1.repos[name];
        repo.setConnection(this.connection);
        return repo;
    };
    Database.prototype.onConnected = function () {
        var _this = this;
        this.ensureDbExists(this.options.db, function () {
            _this.emit('db_exists');
        });
    };
    Database.prototype.onDbExists = function () {
        var _this = this;
        this.ensureSchemaExists(function () {
            _this.emit('schema_exists');
        });
    };
    Database.prototype.onSchemaExists = function () {
        this.emit('ready');
    };
    Database.prototype.ensureDbExists = function (name, callback) {
        var _this = this;
        r.dbList().run(this.connection, function (err, dbList) {
            if (err) {
                console.log('failed to get db list', err);
            }
            else {
                var dbExists = Boolean(dbList.filter(function (dbName) { return dbName === name; }).length);
                if (!dbExists) {
                    r.dbCreate(name).run(_this.connection, function (err) {
                        if (err) {
                            console.log('failed to create db', err);
                        }
                        else {
                            callback();
                        }
                    });
                }
                else {
                    callback();
                }
            }
        });
    };
    Database.prototype.ensureSchemaExists = function (callback) {
        if (!this.schema) {
            return callback();
        }
        this.schema.setConnection(this.connection);
        this.schema.build().then(callback).catch(function (err) {
            console.log(err);
        });
    };
    return Database;
}(events_1.EventEmitter));
exports.Database = Database;
exports.db = new Database();
