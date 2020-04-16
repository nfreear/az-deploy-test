/**
 *
 * @author NDF, 16-April-2020.
 * @see https://docs.microsoft.com/en-us/azure/mysql/concepts-connection-libraries
 * @see https://docs.microsoft.com/en-us/azure/mysql/connect-nodejs
 * @see https://github.com/projectkudu/kudu/wiki/MySQL-in-app#cannot-connect-to-mysql-invalid-settings-or-wrong-usernamepassword
 * @see https://github.com/mysqljs/mysql#connection-options
 */

const mysql = require('mysql2/promise');
const path = require('path');

// const AZ_MYSQL_PATH = '/home/data/mysql/MYSQLCONNSTR_localdb.txt';
const ENV_PATH = path.join(__dirname, '..', '.env'); // path.resolve(process.cwd(), '.env');

console.warn('ENV path :~', ENV_PATH);
console.warn('Azure mysql con. :~', process.env.MYSQLCONNSTR_localdb);

const result = require('dotenv').config({ path: ENV_PATH, debug: true });

if (result.error) {
  throw result.error;
}
console.warn('ENV parsed :~', result.parsed);

databaseTest().then(dbRows => console.warn('DB rows :~', dbRows));

// ---------------------------------

async function databaseTest () {
  try {
    const { host, dbport, user, password, database, debug } = process.env;

    /* const ssl = {
      // DO NOT DO THIS // set up your ca correctly to trust the connection
      rejectUnauthorized: false
    }; */

    const dbConfig = { host, port: dbport, user, password, database, ssl: null, debug };

    console.warn('DB config :~', dbConfig);

    // https://github.com/mysqljs/mysql#connection-options
    const connection = await mysql.createConnection(dbConfig);
    /* const connection = await mysql.createConnection({
      host: ENV.dbhost || 'localhost',
      user: ENV.dbuser || 'root',
      password: ENV.dbpass || '',
      database: ENV.database || 'azure_test',
      debug: ENV.dbdebug || false,
      trace: ENV.dbtrace || false
    }); */

    const [rows] = await connection.query('SELECT * FROM test LIMIT 1'); // fields

    console.warn('Database OK. Connection ID:', connection.threadId);

    // Need to close the connection, for output and exit!
    connection.end();

    return rows;
  } catch (err) {
    console.error('Database error.');
    console.error(err);

    return [
      {
        id: null,
        error: `Database error. ${err.message}`
      }
    ];
  }
}
