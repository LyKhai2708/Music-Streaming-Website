const { DB_HOST, DB_POST, DB_USER, DB_PASS, DB_NAME } = process.env;

module.exports = require('knex')({
    client: 'mysql',
    connection:{
        host: DB_HOST,
        port: DB_POST,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,

    },
    pool: {min: 0, max: 10},
});