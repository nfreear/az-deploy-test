
[![Deploy Node.js to Azure Web App][gh-badge]][gh-link]

# az-deploy-test

Testing continuous deployment (_CD_) to an Azure Web App,
and MySQL database libraries.

 * [ndf-test.azurewebsites.net][site]

Uses a _GitHub workflow_ based on this [YAML template][t]
and the [GitHub context][gc].

## Usage

```sh
npm install
npm start
npm test
```

## Workflow

The workflow _triggers_ and resulting logic-branches are:

 1. A `push` event 	— '_install, build and test_', then [`No deploy`][p]!
 2. Or, a `release published` event — '_install, build and test_', then [`Deploy..`][r]!
 3. Or, a `push` event with `[deploy]` in the commit message — '_install, build and test_', then [`Deploy..`][pd]!

Here is a cut down version of [`.github/workflows/nodejs.yml`][wf]:

```yaml
name: Deploy Node.js to Azure Web App

# ...

on:
  push:
    branches: [master]
  release:
    types: [published]

# ...

jobs:
  build-and-deploy:
    steps:

    # ...

    - name: 'Deploy to Azure WebApp'

      if: "github.event_name == 'release' || contains(github.event.head_commit.message, '[deploy]')"

      uses: azure/webapps-deploy@v2
      with:
        app-name: ${{ env.AZURE_WEBAPP_NAME }}
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: ${{ env.AZURE_WEBAPP_PACKAGE_PATH }}
```

## Actions

These official and third-party actions are used in the workflow:

 * [GitHub: `actions/upload-artifact`][act-ua]
 * [GitHub: `actions/download-artifact`][act-da]
 * [GitHub: `azure/webapps-deploy`][act-azd]

Read [persisting workflow data using artifacts][ar].

## Database

Testing [mysql2][], [knex][] and [bookshelf][] database libraries.

```sh
cp .env.example .env && vi .env
npm run db:test
```

### MySQL

```sql
CREATE TABLE azure_test.test (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR( 24 ) NOT NULL,
  value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB CHARSET = utf8 ;

INSERT INTO azure_test.test ( name, value ) VALUES ( 'greeting', 'Hello world!' );
```

---
License: [MIT](https://nfreear.mit-license.org/ "MIT License | Nick Freear, 20-Mar-2020.").

[mit]: https://nfreear.mit-license.org/ "MIT License | © Nick Freear, 20-March-2020."
[site]: https://ndf-test.azurewebsites.net/
[wf]: https://github.com/nfreear/az-deploy-test/blob/master/.github/workflows/nodejs.yml#L78-L85
  "nodejs YAML"
[gc]: https://help.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#github-context
[t]: https://github.com/Azure/actions-workflow-samples/blob/master/AppService/node.js-webapp-on-azure.yml#L35-L40
  "node.js-webapp-on-azure YAML"
[r]: https://github.com/nfreear/az-deploy-test/runs/524094206?check_suite_focus=true#step:7:1
  "'Publish release' event — Deploy happens!"
[p]: https://github.com/nfreear/az-deploy-test/runs/524091554?check_suite_focus=true#step:6:1
  "'Push' event — NO deploy!"
[pd]: https://github.com/nfreear/az-deploy-test/runs/522102394?check_suite_focus=true#step:7:1
  "'Push' event, with '[deploy]' in commit message — Deploy happens!"
[ar]: https://help.github.com/en/actions/configuring-and-managing-workflows/persisting-workflow-data-using-artifacts#passing-data-between-jobs-in-a-workflow
  "Passing data between jobs in a workflow — GitHub Help"
[ca]: https://help.github.com/en/actions/configuring-and-managing-workflows/caching-dependencies-to-speed-up-workflows#
  "Caching dependencies to speed up workflows — GitHub Help"
[act-ua]:  https://github.com/actions/upload-artifact.git
[act-da]:  https://github.com/actions/download-artifact.git
[act-azd]: https://github.com/azure/webapps-deploy.git

[mysql2]: https://github.com/sidorares/node-mysql2 "'mysql2' — low-level database library"
[knex]: http://knexjs.org/ "'knex.js' — SQL query builder"
[bookshelf]: https://bookshelfjs.org/ "'bookshelf.js' — database ORM"

[gh-badge]: https://github.com/nfreear/az-deploy-test/workflows/Deploy%20Node.js%20to%20Azure/badge.svg
[gh-link]:  https://github.com/nfreear/az-deploy-test/actions
  "Status — 'Deploy Node.js to Azure Web App'"
