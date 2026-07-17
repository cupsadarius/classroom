import {EventEmitter} from 'events';
import * as r from 'rethinkdb';
import params from '../configs/params';
export type Table = {
    name: string,
    options: Object,
};

export default class DatabaseSchema extends EventEmitter {
    private tables: Table[];
    private connection: r.Connection;

    constructor() {
        super();
        this.tables = [];
    }

    public setConnection(connection: r.Connection) {
        this.connection = connection;
    }

    public addTable(name: string, options: Object) {
        this.tables.push({name, options});
    }

    public build() {
        const promises = [];
        for (let i = 0; i < this.tables.length; i++) {
            promises.push(this.buildTable(this.tables[i]));
        }
        return Promise.all(promises);
    }

    public buildTable(table: Table) {
        return new Promise((resolve, reject) => {
           r.db(params.DB_NAME).tableList()
               .run(this.connection, (err: Object, tableList: string[]) => {
                  if (err) {
                      return reject(err);
                  }
                  const tableExists = Boolean(tableList.filter(tableName => tableName === table.name).length);
                  if (!tableExists) {
                      r.db(params.DB_NAME).tableCreate(table.name, table.options)
                          .run(this.connection, (err: Object, result: Object) => {
                              if (err) {
                                  return reject(err);
                              }
                              resolve(result);
                          });
                  } else {
                      resolve(tableExists);
                  }
               });
        });
    }
}