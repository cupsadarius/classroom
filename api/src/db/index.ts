/// <reference path="../../typings/tsd.d.ts" />

import {EventEmitter} from 'events';
import * as rethink from 'rethinkdb';
import {repos} from './repositories';
import BaseRepository from './repositories/BaseRepository';
import DatabaseSchema from './schema';

export class Database extends EventEmitter {
    public connection: Object;
    public schema: DatabaseSchema;
    public options: {db?: string};

    constructor() {
        super();
        this.connection = null;
        this.schema = null;
        this.options = {};

        this.on('connected', this.onConnected.bind(this));
        this.on('db_exists', this.onDbExists.bind(this));
        this.on('schema_exists', this.onSchemaExists.bind(this));
    }

    public setSchema(schema: DatabaseSchema): void {
        this.schema = schema;
    }

    public connect(options: {}) {
        this.options = options;
        rethink.connect(options, (err: Object, conn: Object) => {
            if (err) {
                this.emit('error', err, 'connection');
            }

            this.connection = conn;
            this.emit('connected', conn);
        });
    }

    public getRepo(name: string): BaseRepository {
        const repo: BaseRepository = repos[name];
        repo.setConnection(this.connection);
        return repo;
    }

    private onConnected() {
        this.ensureDbExists(this.options.db, () => {
            this.emit('db_exists');
        });
    }

    private onDbExists() {
        this.ensureSchemaExists(() => {
            this.emit('schema_exists');
        });
    }

    private onSchemaExists() {
        this.emit('ready');
    }

    public ensureDbExists(name: string, callback: Function) {
        rethink.dbList().contains(name)
            .do((databaseExists: boolean) => {
                return rethink.branch(databaseExists, {dbExists: 1}, rethink.dbCreate(name));
            })
            .run(this.connection, () => {
                callback();
            });
    }

    public ensureSchemaExists(callback: () => void) {
        if (!this.schema) {
            return callback();
        }

        this.schema.setConnection(this.connection);
        this.schema.build().then(callback, (err: Object) => {
            console.log(err);
        });
    }

}

export let db = new Database();
