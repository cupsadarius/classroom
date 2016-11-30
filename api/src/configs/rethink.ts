const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;

import * as Q from 'q';
import {db} from '../db/index';
import DatabaseSchema from '../db/schema';

const schema = new DatabaseSchema();
schema.addTable('users', {});

db.setSchema(schema);

// init database connection
export default function () {
  const defer = Q.defer();
    // wait for db to start
  db.on('ready', defer.resolve);
  db.on('error', defer.reject);
  db.connect({
    host: DB_HOST,
    port: DB_PORT,
    db: DB_NAME,
  });
  return defer.promise;
};
