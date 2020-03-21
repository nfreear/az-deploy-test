/**
 * Get Azure deployment, and GitHub release information.
 *
 * @author NDF, 20-March-2020.
 */

/*
const GIT_LOG = 'git log --pretty=oneline --abbrev-commit --date=short --graph -1';

DEPLOYMENT_SOURCE=D:\home
DEPLOYMENT_TARGET=D:\home\site\wwwroot

SCM_GIT_EMAIL=windowsazure
SCM_GIT_USERNAME=windowsazure

WEBSITE_NODE_DEFAULT_VERSION=12.13.0
OS=Windows_NT
WINDIR=D:\Windows
*/

const DEF_GITHUB_CONTEXT = '../github-context';
const ENV = process.env;

function getAzureDeploymentData () {
  const httpHost = ENV.HTTP_HOST || null;

  return {
    siteName: ENV.WEBSITE_SITE_NAME || 'NONE',
    resourceGroup: ENV.WEBSITE_RESOURCE_GROUP || null,
    nodeVersion: ENV.WEBSITE_NODE_DEFAULT_VERSION || null,
    scmType: ENV.ScmType || null, // 'GitHub' or 'None';
    isAzure: httpHost && /\.azurewebsites\.net/.text(httpHost) ? 1 : 0,
    isWindows: ENV.WINDIR ? 1 : 0,
    OS: ENV.OS || null
  };
}

function getGitReleaseData (githubContexFile = DEF_GITHUB_CONTEXT) {
  let ghContext;

  try {
    ghContext = require(githubContexFile);

    console.log('GitHub context: live');
  } catch (ex) {
    console.log('GitHub context: using fallback sample');
    console.error('(Error)', ex.message);

    ghContext = require('./github-context.release-sample');
  }

  const rel = ghContext.event.release || null;

  return {
    eventName: ghContext.event_name,
    SHA: ghContext.sha.substring(0, 10),
    commit: ghContext.event.head_commit || null,
    release: rel ? {
      name: rel.name,
      tag_name: rel.tag_name,
      published_at: rel.published_at,
      html_url: rel.html_url,
      body: rel.body
    } : null
  };
}

module.exports = {
  getAzureDeploymentData,
  getGitReleaseData
};
