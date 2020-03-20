/**
 * A HTTP server whose API returns info about the deployment & environment.
 *
 * @author NDF, 20-March-2020.
 */

/*
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

let ghContext;
try {
  ghContext = require('../github-context');
  console.log('GitHub context: live');
} catch (ex) {
  console.log('GitHub context: using fallback sample');
  console.error('(Error)', ex.message);
  ghContext = require('./github-context.release-sample');
}

const siteName = process.env.WEBSITE_SITE_NAME || 'NONE';
const azureResGroup = process.env.WEBSITE_RESOURCE_GROUP || null;
const httpHost = process.env.HTTP_HOST || null;
const scmType = process.env.ScmType || null; // 'GitHub' or 'None';
const isAzure = httpHost && /\.azurewebsites\.net/.text(httpHost) ? 1 : 0;
const isWindows = process.env.WINDIR ? 1 : 0;
const OS = process.env.OS || null;
const PORT = 8000;

const SHA = ghContext.sha.substring(0, 10);
const deployEvent = ghContext.event_name;
const gitCommit = ghContext.event.head_commit || null;
const rel = ghContext.event.release || null;
const release = rel ? { name: rel.name, tag: rel.tag_name, published_at: rel.published_at, url: rel.html_url, body: rel.body } : null;

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

  // E.g. {"siteName":"NONE","azureResGroup":null,"pkgVersion":"0.8.5","OS":null,"isWindows":0,"isAzure":0,"httpHost":null,"scmType":null,"hello":{"name?":"Test"},"deployEvent":"push","gitCommit":{..}
  res.send({ siteName, azureResGroup, pkgVersion, OS, isWindows, isAzure, httpHost, scmType, hello: req.params, deployEvent, gitCommit, release, SHA });

  next(false); // 'false' -- Stop processing!
});
