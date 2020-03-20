/**
 *
 * @author NDF, 20-March-2020.
 */

/*
deployment_branch=master
DEPLOYMENT_SOURCE=D:\home
DEPLOYMENT_TARGET=D:\home\site\wwwroot

SCM_GIT_EMAIL=windowsazure
SCM_GIT_USERNAME=windowsazure

WEBSITE_NODE_DEFAULT_VERSION=12.13.0
OS=Windows_NT
WINDIR=D:\Windows
*/

const pkgVersion = require('../package').version;
const restify = require('restify');
const join = require('path').join;

const siteName = process.env.WEBSITE_SITE_NAME || 'unknown';
const azResGroup = process.env.WEBSITE_RESOURCE_GROUP || null;
const httpHost = process.env.HTTP_HOST || null;
const scmType = process.env.ScmType || null; // 'GitHub' or 'None';
const isAzure = httpHost && /\.scm\.azurewebsites\.net/.text(httpHost) ? 1 : 0;
const isWindows = process.env.WINDIR ? 1 : 0;
const OS = process.env.OS || null;
// const gitPath = isWinAzure ? 'D:/home/site/repository' : join(__dirname, '..');
const PORT = 8000;

// Create HTTP server.
const server = restify.createServer();

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

  // E.g. {"siteName":"unknown","scmType":null,"hello":{"name?":"Nick"}}
  res.send({ siteName, azResGroup, pkgVersion, OS, isWindows, isAzure, scmType, hello: req.params });

  next(false); // 'false' -- Stop processing!
});
