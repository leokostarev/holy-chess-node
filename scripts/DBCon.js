const {raise, raise_if} = require("./utils");
const Dotenv = require("dotenv");
const Mysql = require("mysql");


Dotenv.config();

const connection = Mysql.createConnection({
    host:     process.env.DB_HOST || raise("DB_HOST NOT SPECIFIED"),
    user:     process.env.DB_USER || raise("DB_USER NOT SPECIFIED"),
    password: process.env.DB_PASS || raise("DB_PASS NOT SPECIFIED"),
    database: process.env.DB_NAME || raise("DB_NAME NOT SPECIFIED"),
});
connection.connect();
process.on("exit", () => connection.end(raise_if));

function make_query(query, ...params) {
    return new Promise((resolve, reject) => {
        connection.query(query, ...params, (err, results, _) => {
            if (err)
                reject(err);
            else
                resolve(results);
        });
    });
}

async function get_all_users() {
    return await make_query("SELECT * FROM users");
}

async function fail_query() {
    return await make_query("SELECT * FROM huis");
}

module.exports = exports = {
    connection:    connection,
    get_all_users: get_all_users,
    fail_query:    fail_query,

};