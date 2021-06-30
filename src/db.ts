const Pool = require('pg').Pool;

const pool = new Pool({
    user: "me",
    password: "password",
    host: "localhost",
    port: 5432,
    database: "toy_login_api"
});

module.exports = pool;