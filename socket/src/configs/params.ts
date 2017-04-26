/**
 * Object that holds the environment parameters.
 */
export default {
    DB_HOST: process.env.DB_HOST || 'db.classroom.dkr',
    DB_PORT: process.env.DB_PORT || '28015',
    DB_NAME: process.env.DB_NAME || 'classroom',
    APP_PORT: process.env.PORT || 3000,
    SECRET: process.env.SECRET || 'averysecretstringhereusedforallkindsofstuff',
};
