"use strict";
var r = require("rethinkdb");
var BaseRepository = (function () {
    function BaseRepository(table) {
        this.table = table;
        this.connection = null;
    }
    BaseRepository.prototype.setConnection = function (conn) {
        this.connection = conn;
    };
    /**
     * Method used for inserting data into the table.
     * @param data
     * @returns {Promise<T>}
     */
    BaseRepository.prototype.insert = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            r.table(_this.table).insert(data)
                .run(_this.connection, function (err, result) {
                if (err) {
                    return reject(err);
                }
                resolve(result.generated_keys[0]);
            });
        });
    };
    /**
     * Methid used for updating the data inside the table.
     * @param filter
     * @param data
     * @returns {Promise<T>}
     */
    BaseRepository.prototype.update = function (filter, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            r.table(_this.table).filter(filter).update(data)
                .run(_this.connection, function (err, result) {
                if (err) {
                    return reject(err);
                }
                resolve(result.replaced || result.unchanged);
            });
        });
    };
    /**
     * Method used for deleting data from the table
     * @param ids
     * @returns {Promise<T>}
     */
    BaseRepository.prototype.delete = function (ids) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var query = r.table(_this.table);
            query.getAll.apply(query, ids).delete()
                .run(_this.connection, function (err, result) {
                if (err) {
                    return reject(err);
                }
                resolve(result.deleted);
            });
        });
    };
    /**
     * Method used for getting one record from the table.
     * @param id
     * @returns {Promise<T>}
     */
    BaseRepository.prototype.get = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            r.table(_this.table).get(id).run(_this.connection, function (err, result) {
                if (err) {
                    return reject(err);
                }
                if (result) {
                    resolve(result);
                }
                else {
                    resolve(null);
                }
            });
        });
    };
    /**
     * Method used to take an array of records based on ids from the table.
     * @param ids
     * @returns {Promise<T>}
     */
    BaseRepository.prototype.getAllByIds = function (ids) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var query = r.table(_this.table);
            query.getAll.apply(query, ids).run(_this.connection, function (err, result) {
                if (err) {
                    return reject(err);
                }
                if (result) {
                    resolve(result.toArray());
                }
                else {
                    resolve(null);
                }
            });
        });
    };
    /**
     * Method used to get all records from the table.
     * @returns {Promise<T[]>}
     */
    BaseRepository.prototype.getAll = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            r.table(_this.table).run(_this.connection, function (err, result) {
                if (err) {
                    return reject(err);
                }
                if (result) {
                    resolve(result.toArray());
                }
                else {
                    resolve(null);
                }
            });
        });
    };
    /**
     * Method used to search a record in the table.
     * @param filter
     * @returns {Promise<T[]>}
     */
    BaseRepository.prototype.filter = function (filter) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            r.table(_this.table).filter(filter).run(_this.connection, function (err, result) {
                if (err) {
                    return reject(err);
                }
                if (result) {
                    resolve(result.toArray());
                }
                else {
                    resolve(null);
                }
            });
        });
    };
    /**
     * Method used to count how many records exists in the table based on a filter.
     * @param filter
     * @returns {Promise<T>}
     */
    BaseRepository.prototype.count = function (filter) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            r.table(_this.table).filter(filter).count().
                run(_this.connection, function (err, result) {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    };
    return BaseRepository;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BaseRepository;
