const { Pool } = require('pg');

module.exports = new Pool ({
    host: "localhost",
    user: "sess",
    database: "members_only",
    password: "sess",
    port: 5432
});