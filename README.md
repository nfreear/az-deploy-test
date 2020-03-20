
# az-deploy-test

Testing continuous deployment (_CD_) to Azure Web App.

It uses a _GitHub workflow_ based on this [YAML template][t]
and the [GitHub context][gc].

Here is a cut down version of [`.github/workflows/nodejs.yml`][w]:

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

    - name: 'Deploy to Azure WebApp (release only)'

      if: "github.event_name == 'release'"

      uses: azure/webapps-deploy@v2
      with:
        app-name: ${{ env.AZURE_WEBAPP_NAME }}
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: ${{ env.AZURE_WEBAPP_PACKAGE_PATH }}
```

---
License: [MIT](https://nfreear.mit-license.org/ "MIT License")

[w]: https://github.com/nfreear/az-deploy-test/blob/master/.github/workflows/nodejs.yml#L54-L61
  "nodejs YAML"
[gc]: https://help.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#github-context
[t]: https://github.com/Azure/actions-workflow-samples/blob/master/AppService/node.js-webapp-on-azure.yml#L35-L40
  "node.js-webapp-on-azure YAML"
