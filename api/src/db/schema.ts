/// <reference path="../../typings/tsd.d.ts"/>

import {EventEmitter} from 'events';
import * as rethink from 'rethinkdb';
import * as Q from 'q';

export type Table = {
    name: string,
    options: Object,
};

export default class DatabaseSchema extends EventEmitter {
    private tables: Table[];
    private connection: Object;

    constructor() {
        super();
        this.tables = [];
    }

    public setConnection(conn: Object) {
        this.connection = conn;
    }

    public addTable(name: string, options: Object) {
        this.tables.push({name, options});
    }

    public build() {
        const promises: Promise<Object>[] = [];
        for (let i = 0; i < this.tables.length; i++) {
            promises.push(this.buildTable(this.tables[i]));
        }
        return Q.all(promises);
    }

    public buildTable(table: Table): Promise<Object> {
        const defer = Q.defer();
        rethink.tableList().contains(table.name)
            .do((tableExists: boolean) => {
                return rethink.branch(tableExists, {tableExists: 1}, rethink.tableCreate(table.name, table.options));
            })
            .run(this.connection, (err: Object, result: Object) => {
                    if (err) {
                        return defer.reject(err);
                    }
                    defer.resolve(result);
                }
            );
        return defer.promise;
    }

}
