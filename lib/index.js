/**
 * A HTTP server whose API returns info about the deployment & environment.
 *
 * @author NDF, 20-March-2020.
 */

const {
  getAzureDeploymentData, getGitReleaseData
} = require('./az-deployment-release-data');

const pkgVersion = require('../package').version;
const restify = require('restify');
const PORT = 8000;

// Create HTTP server.
const server = restify.createServer({
  // https://github.com/restify/node-restify/issues/1042#issuecomment-201542689
  // https://github.com/makeomatic/restify-formatter-jsonapi/blob/master/src/index.js#L45
  formatters: {
    'application/json': (req, res, body, cb = null) => {
      // console.log('JSON formatter:', typeof req, typeof res, typeof body, cb);

      // return cb(null, JSON.stringify(body, null, '\t'));
      return JSON.stringify(body, null, '\t');
    }
  }
});

server.listen(process.env.port || process.env.PORT || PORT || 3978, () => {
  console.log(`\n${server.name} listening to ${server.url}`);
});

// Listen for incoming requests.
server.get('/api/messages/:name?', (req, res, next) => {
  /* adapter.processActivity(req, res, async (context) => {
    // Route to main dialog.
    await bot.run(context)
  }) */

  res.header('X-foo', 'bar');

  // E.g. {"siteName":"NONE","azureResGroup":null,"pkgVersion":"0.8.5","OS":null,"isWindows":0,"isAzure":0,"httpHost":null,"scmType":null,"hello":{"name?":"Test"},"deployEvent":"push","gitCommit":{..}
  res.send({
    azureDeploy: getAzureDeploymentData(),
    github: getGitReleaseData(),
    pkgVersion,
    hello: req.params
  }, null, 2);

  next(false); // 'false' -- Stop processing!
});
