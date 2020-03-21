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

const DEFAULT_GH_CONTEXT = '../github-context.json';
const FALLBACK_GH_CONTEXT = './github-context.release-sample';
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

function getGithubReleaseData (ghContextFile = DEFAULT_GH_CONTEXT, fallback = FALLBACK_GH_CONTEXT) {
  let ghContext;

  try {
    ghContext = require(ghContextFile);

    console.log('GitHub context ~ Live', ghContextFile);
  } catch (ex) {
    console.log('GitHub context ~ Using fallback:', fallback);
    console.error('(Error)', ex.message);

    ghContext = require(fallback);
  }

  const rel = ghContext.event.release || null;
  const ghEvent = ghContext.event;

  return {
    eventName: ghContext.event_name,
    commitSha: ghContext.sha.substring(0, 10),
    commitUrl: ghEvent.repository.git_commits_url,
    repoUrl: ghEvent.repository.html_url,
    commit: ghEvent.head_commit || null,
    release: rel ? {
      name: rel.name,
      tagName: rel.tag_name,
      publishedAt: rel.published_at,
      htmlUrl: rel.html_url,
      body: rel.body
    } : null
  };
}

module.exports = {
  DEFAULT_GH_CONTEXT,
  getAzureDeploymentData,
  getGithubReleaseData
};
