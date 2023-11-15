const {raise, raise_if} = require("./utils");
const Dotenv = require("dotenv");
const Mysql = require("mysql");
const util = require("util");


Dotenv.config();

const connection = Mysql.createConnection({
    host:     process.env.DB_HOST || raise("DB_HOST NOT SPECIFIED"),
    user:     process.env.DB_USER || raise("DB_USER NOT SPECIFIED"),
    password: process.env.DB_PASS || raise("DB_PASS NOT SPECIFIED"),
    database: process.env.DB_NAME || raise("DB_NAME NOT SPECIFIED"),
});
connection.connect();

process.on("exit", () => connection.end(raise_if));

// async function make_query(query, ...params) {
//     return await new Promise((resolve, reject) => {
//         connection.query(query, ...params, (err, results, _) => {
//             if (err)
//                 reject(err);
//             else
//                 resolve(results);
//         });
//     });
// }

const make_query = util.promisify(connection.query).bind(connection);


module.exports = exports = {
    connection: connection,
    async get_all_users() {
        return await make_query("SELECT * FROM users");
    },

    async get_user_by_id(id) {
        return await make_query("SELECT * FROM users WHERE id = ?", id);
    },

    async fail_query() {
        return await make_query("SELECT * FROM huis");
    },
};