# GitHub Action - Establish Context
This GitHub action establishes the context for a release. It outputs whether a release should be triggered, the release type (major, minor, patch, prerelease), which version the repository is currently on and whehter or not the release was triggered as part of a cascading release.

When workflow is triggered by a [pull_request event](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#pull-request-event-pull_request) with `type = closed` it will look for major, minor and patch labels on the pull request and the the 'greatest' release type and signigy that it should trigger a release.

![Github JavaScript Actions CI/CD](https://github.com/dolittle/establish-context-action/workflows/Github%20JavaScript%20Actions%20CI/CD/badge.svg)

### Pre requisites
Create a workflow `.yml` file in your `.github/workflows` directory. An [example workflow](#example-workflow) is available below.

Note that the workflow has to be able to be triggered by a closed pull_request event for it to work properly. See `on`in the [example workflow](#example-workflow) below.

For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file)

### Inputs
- `token`: The token to use for the GitHub API. default: ${{ github.token }}
- `prerelease-branches`: A comma separated list of prerealease identifier suffixes to branch names that when merged a PR to will trigger a prerelease. deafult: ''

#### `prerelease-branches`
A comma separated list of prerelease identifiers. It will output `should-publish = true` whenever a pull request is merged to a branch with a name which is a version with one of the given prerelease-branches identifers. It will also make sure to use the version in the branch name as part of the outputtet `current-version` and use the latest vesrion that is tagged that is equal to that prerelease version. For instance if a pull request is merged to the branch `2.0.0-alpha` and the repository has a tag named `2.0.0-alpha.20` `should-publish` should be `true`, `current-version` should be `2.0.0-alpha.20` and `release-type` should be prerelease. If there are no tags starting with `2.0.0-alpha` then that will be the `current-version` output.

### Outputs
- `should-publish`: Whether or not the pipeline should publish
- `current-version`: The current version of the repository derived from the tags or 0.0.0 if there are no version tags
- `release-type`: The type of the release. Either major, minor, patch or prerelease
- `cascading-release`: Whether the publish was triggered by a cascading release

### Example Workflow
```yaml
on:
  push:
    branches:
    - '**'
  pull_request:
    types: [closed]

name: Establish Context

jobs:
  context:
    name: Establish Context
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      - name: Establish Context
        id: context
        uses: dolittle/establish-context-action@v2
        
```

### Example Workflow - with prerelease branches
```yaml
on:
  push:
    branches:
    - '**'
  pull_request:
    types: [closed]

name: Establish Context

jobs:
  context:
    name: Establish Context
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      - name: Establish Context
        id: context
        uses: dolittle/establish-context-action@v2
        with:
          prerelease-branches: alpha,beta,rc
        
```
## Contributing
We're always open for contributions and bug fixes!

### Pre requisites
- node <= 12
- yarn
- git
