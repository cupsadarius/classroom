import {EventEmitter} from 'events';
import * as r from 'rethinkdb';
import {repos} from './repositories';
import BaseRepository from './repositories/BaseRepository';
import DatabaseSchema from './schema';

export class Database extends EventEmitter {
    public connection: r.Connection;
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
        r.connect(options, (err: Object, conn: r.Connection) => {
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
        r.dbList().run(this.connection, (err: Object, dbList: string[]) => {
            if (err) {
                console.log('failed to get db list', err);
            } else {
                const dbExists = Boolean(dbList.filter(dbName => dbName === name).length);
                if (!dbExists) {
                    r.dbCreate(name).run(this.connection, (err: Object) => {
                       if (err) {
                           console.log('failed to create db', err);
                       } else {
                           callback();
                       }
                    });
                } else {
                    callback();
                }
            }
        });
    }

    public ensureSchemaExists(callback: () => void) {
        if (!this.schema) {
            return callback();
        }
        this.schema.setConnection(this.connection);
        this.schema.build().then(callback).catch((err: Object) => {
            console.log(err);
        });
    }

}

export const db = new Database();
