import params from './params';
import {db} from '../db';
import DatabaseSchema from '../db/schema';

const schema = new DatabaseSchema();
schema.addTable('users', {});
schema.addTable('blacklist', {});
schema.addTable('lessons', {});
schema.addTable('categories', {});
schema.addTable('classrooms', {});
schema.addTable('sessions', {});
db.setSchema(schema);

export default async () => {
    return new Promise((resolve, reject) => {
        db.on('ready', resolve);
        db.on('error', reject);
        db.connect({
            host: params.DB_HOST,
            port: params.DB_PORT,
            db: params.DB_NAME,
        });
    });
};
