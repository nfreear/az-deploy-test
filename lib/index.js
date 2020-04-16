/**
 * A HTTP server whose API returns info about the deployment & environment.
 *
 * @author NDF, 20-March-2020.
 */

const {
  getAzureDeploymentData, getGithubReleaseData
} = require('./az-deployment-release-data');

const pkgVersion = require('../package').version;
const join = require('path').join;
const restify = require('restify');
const mysql = require('mysql2/promise');
const path = require('path');

const ENV_PATH = path.join(__dirname, '..', '.env');

console.warn('ENV path :~', ENV_PATH);

require('dotenv').config({ path: ENV_PATH });

const ENV = process.env;
const IS_LOCAL = process.argv.slice(-1)[0] === '--local';

// Create HTTP server.
const server = restify.createServer({
  // https://github.com/restify/node-restify/issues/1042#issuecomment-201542689
  // https://github.com/makeomatic/restify-formatter-jsonapi/blob/master/src/index.js#L45
  formatters: {
    'application/json': (req, res, body) => {
      // console.log('JSON formatter:', typeof req, typeof res, typeof body, cb);
      return JSON.stringify(body, null, '\t');
    }
  }
});

server.listen(ENV.port || ENV.PORT || 8000 || 3978, () => {
  console.log(`\n${server.name} listening to ${server.url}`);
});

// Listen for incoming requests.
server.get('/api/messages/:name?', async (req, res, next) => {
  /* adapter.processActivity(req, res, async (context) => {
    // Route to main dialog.
    await bot.run(context)
  }) */

  const dbRows = await databaseTest();

  res.header('X-foo', 'bar');

  // E.g. {"siteName":"NONE","azureResGroup":null,"pkgVersion":"0.8.5","OS":null,"isWindows":0,"isAzure":0,"httpHost":null,"scmType":null,"hello":{"name?":"Test"},"deployEvent":"push","gitCommit":{..}
  res.send({
    azureDeploy: getAzureDeploymentData(),
    github: getGithubReleaseData(),
    pkgVersion,
    dbRows,
    hello: req.params
  }, null, 2);

  next(false); // 'false' -- Stop processing!
});

if (IS_LOCAL) {
  console.log('Running locally!');

  server.get('/', restify.plugins.serveStatic({
    directory: join(__dirname, '..', 'public'),
    file: 'index.html'
  }));

  server.get('/style.css', restify.plugins.serveStatic({
    directory: join(__dirname, '..', 'public'),
    file: 'style.css'
  }));
}

async function databaseTest () {
  const { host, dbport, user, password, database, debug } = process.env;

  /* const ssl = {
    // DO NOT DO THIS // set up your ca correctly to trust the connection
    rejectUnauthorized: false
  }; */

  const dbConfig = { host, port: dbport, user, password, database, ssl: null, debug };

  console.warn('DB config :~', dbConfig);

  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.query('SELECT * FROM test LIMIT 1'); // fields

    console.warn('Database OK.');

    // Need to close the connection, for output and exit!
    connection.end();

    return rows;
  } catch (err) {
    console.error('Database error.');
    console.error(err);

    return [
      {
        id: null,
        error: `Database error. ${err.message}`,
        stack: ENV.danger ? err.stack.split('\n') : null,
        env: ENV.danger ? ENV.MYSQLCONNSTR_localdb : null,
        config: ENV.danger ? dbConfig : null
      }
    ];
  }
}
