const { Pool } = require("pg");

module.exports = new Pool({
    host: "localhost", // or wherever the db is hosted
    user: "sess",
    database: "members_only",
    password: "sess",
    port: 5432 // The default port
});