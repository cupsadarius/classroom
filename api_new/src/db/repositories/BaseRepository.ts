import * as r from 'rethinkdb';
import deleteProperty = Reflect.deleteProperty;

type DbResult = {
    deleted: number,
    errors: number,
    generated_keys: string[],
    inserted: number,
    replaced: number,
    skipped: number,
    unchanged: number,
};

export default class BaseRepository {
    private table: string;
    private connection: r.Connection;

    constructor(table: string) {
        this.table = table;
        this.connection = null;
    }

    public setConnection(conn: r.Connection) {
        this.connection = conn;
    }

    /**
     * Method used for inserting data into the table.
     * @param data
     * @returns {Promise<T>}
     */
    public insert(data: Object) {
       return new Promise((resolve, reject) => {
          r.table(this.table).insert(data)
              .run(this.connection, (err: Object, result: DbResult) => {
                  if (err) {
                      return reject(err);
                  }
                  resolve(result.generated_keys[0]);
              });
       });
    }

    /**
     * Methid used for updating the data inside the table.
     * @param filter
     * @param data
     * @returns {Promise<T>}
     */
    public update(filter: {[key: string]: any}, data: Object) {
        return new Promise((resolve, reject) => {
            r.table(this.table).filter(filter).update(data)
                .run(this.connection, (err: Object, result: DbResult) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result.replaced || result.unchanged);
                });
        });
    }

    /**
     * Method used for deleting data from the table
     * @param ids
     * @returns {Promise<T>}
     */
    public delete(ids: string[]) {
        return new Promise((resolve, reject) => {
            const query = r.table(this.table);
            query.getAll.apply(query, ids).delete()
                .run(this.connection, (err: Object, result: DbResult) => {
                   if (err) {
                       return reject(err);
                   }
                   resolve(result.deleted);
                });
        });
    }

    /**
     * Method used for getting one record from the table.
     * @param id
     * @returns {Promise<T>}
     */
    public get(id: string) {
        return new Promise((resolve, reject) => {
            r.table(this.table).get(id).run(this.connection, (err: Object, result: r.Cursor) => {
                if (err) {
                   return reject(err);
                }
                if (result) {
                    resolve(result);
                } else {
                    resolve(null);
                }
            });
        });
    }

    /**
     * Method used to take an array of records based on ids from the table.
     * @param ids
     * @returns {Promise<T>}
     */
    public getAllByIds(ids: string[]) {
        return new Promise((resolve, reject) => {
            const query = r.table(this.table);
            query.getAll.apply(query, ids).run(this.connection, (err: Object, result: r.Cursor) => {
               if (err) {
                   return reject(err);
               }
               if (result) {
                   resolve(result.toArray());
               } else {
                   resolve(null);
               }
            });
        });
    }

    /**
     * Method used to get all records from the table.
     * @returns {Promise<T[]>}
     */
    public getAll() {
        return new Promise((resolve, reject) => {
           r.table(this.table).run(this.connection, (err: Object, result: r.Cursor) => {
              if (err) {
                  return reject(err);
              }
              if (result) {
                  resolve(result.toArray());
              } else {
                  resolve(null);
              }
           });
        });
    }

    /**
     * Method used to search a record in the table.
     * @param filter
     * @returns {Promise<T[]>}
     */
    public filter(filter: {[key: string]: any}) {
        return new Promise((resolve, reject) => {
            r.table(this.table).filter(filter).run(this.connection, (err: Object, result: r.Cursor) => {
                if (err) {
                    return reject(err);
                }
                if (result) {
                    resolve(result.toArray());
                } else {
                    resolve(null);
                }
            });
        });
    }

    /**
     * Method used to count how many records exists in the table based on a filter.
     * @param filter
     * @returns {Promise<T>}
     */
    public count(filter: {[key: string]: any}) {
        return new Promise((resolve, reject) => {
           r.table(this.table).filter(filter).count().
           run(this.connection, (err: Object, result: number) => {
               if (err) {
                   return reject(err);
               }
               resolve(result);
           });
        });
    }
}