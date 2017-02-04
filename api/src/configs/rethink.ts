const DB_HOST = process.env.DB_HOST || 'db.classroom.dkr';
const DB_PORT = process.env.DB_PORT || '28015';
const DB_NAME = process.env.DB_NAME || 'classroom';

import * as Q from 'q';
import {db} from '../db/index';
import DatabaseSchema from '../db/schema';

const schema = new DatabaseSchema();
schema.addTable('users', {});
schema.addTable('blacklist', {});
schema.addTable('lessons', {});
schema.addTable('categories', {});

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
