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

require('dotenv').config();

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
  try {
    const connection = await mysql.createConnection({
      host: ENV.dbhost || 'localhost',
      user: ENV.dbuser || 'root',
      password: ENV.dbpass || '',
      database: ENV.database || 'azure_test'
    });

    const [rows] = await connection.query('SELECT * FROM test'); // fields

    console.log('Database OK.');

    return rows;
  } catch (err) {
    console.error('Database error.', err.message);

    return null;
  }
}
