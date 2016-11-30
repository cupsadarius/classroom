/// <reference path="../../../typings/tsd.d.ts"/>

import * as r from 'rethinkdb';
import * as Q from 'q';

type DbResult = {
    deleted: number,
    errors: number,
    generated_keys: string[],
    inserted: number,
    replaced: number,
    skipped: number,
    unchanged: number,
};

type Cursor = {
    toArray: () => {};
};

export default class BaseRepository {
    private table: string;
    private connection: Object;

    constructor(table: string) {
        this.table = table;
        this.connection = null;
    }

    public setConnection(conn: Object) {
        this.connection = conn;
    }

    public insert(data: Object) {
        const defer = Q.defer();
        r.table(this.table).insert(data)
            .run(this.connection, (err: Object, result: DbResult) => {
                console.log(err, result);
                if (err) {
                    defer.reject(err);
                } else {
                    defer.resolve(result.generated_keys[0]);
                }
            });
        return defer.promise;
    }

    public update(filter: Object | string, data: Object) {
        const defer = Q.defer();
        if (typeof filter === 'string') {
            filter = {id: filter};
        }
        r.table(this.table).filter(filter).update(data)
            .run(this.connection, (err: Object, result: DbResult) => {
                if (err) {
                    return defer.reject(err);
                }
                defer.resolve(result.replaced);
            });
        return defer.promise;
    }

    public delete(ids: string[]) {
        const defer = Q.defer();
        const query = r.table(this.table);
        query.getAll.apply(query, ids).delete().run(this.connection, (err: Object, result: DbResult) => {
            if (err) {
                return defer.reject(err);
            }
            defer.resolve(result.deleted);
        });
        return defer.promise;
    }

    public get(id: string) {
        const defer = Q.defer();
        r.table(this.table).get(id).run(this.connection, (err: Object, result: Cursor) => {
            if (err) {
                return defer.reject(err);
            }
            defer.resolve(result);
        });
        return defer.promise;
    }

    public getAllByIds(ids: string[]) {
        const defer = Q.defer();
        const query = r.table(this.table);
        query.getAll.apply(query, ids).run(this.connection, (err: Object, result: Cursor) => {
            if (err) {
                return defer.reject(err);
            }
            defer.resolve(result.toArray());
        });
        return defer.promise;
    }

    public getAll() {
        const defer = Q.defer();
        r.table(this.table).run(this.connection, (err: Object, result: Cursor) => {
            if (err) {
                return defer.reject(err);
            }
            defer.resolve(result.toArray());
        });
        return defer.promise;
    }

    public filter(filter: Object) {
        const defer = Q.defer();
        if (typeof filter === 'string') {
            filter = {id: filter};
        }
        r.table(this.table).filter(filter)
            .run(this.connection, (err: Object, result: Cursor) => {
                if (err) {
                    return defer.reject(err);
                }

                defer.resolve(result.toArray());
            });
        return defer.promise;
    }

    public count(filter: Object) {
        const defer = Q.defer();
        if (typeof filter === 'string') {
            filter = {id: filter};
        }
        r.table(this.table).filter(filter).count()
            .run(this.connection, (err: Object, result: number) => {
                if (err) {
                    return defer.reject(err);
                }
                defer.resolve(result);
            });
        return defer.promise;
    }
}
