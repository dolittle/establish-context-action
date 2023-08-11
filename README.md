# GitHub Action - Establish Context
This GitHub action establishes the context for a release. It outputs whether a release should
be triggered, the release type (major, minor, patch, prerelease) and which version the repository
is currently on 

When workflow is triggered by a [pull_request event](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#pull-request-event-pull_request)
with `type = closed` it will look for major, minor and patch labels on the pull request and
use the 'greatest' release type. Only pull requests merged to the 'master'/'main' branch and given
prerelease branches will trigger releases.

![Github JavaScript Actions CI/CD](https://github.com/woksin-org/establish-context-action/workflows/CI/CD/badge.svg)

## Usage

Create a workflow `.yml` file in your `.github/workflows` directory. An [example workflow](#example-workflow) is available below.

Note that the workflow has to be able to be triggered by a closed pull_request event for it
to work properly. See `on`in the [example workflow](#example-workflow) below.

For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file)

### Inputs

- `token`: The token to use for the GitHub API. default: ${{ github.token }}
- `prerelease-branches`: A comma separated list of prerelease identifier suffixes to branch names that when merged a PR to will trigger a prerelease. default: ''
- `current-version`: If the version is known, you can specify it with this. default: ''
- `version-file`: If the version is in a file adhering to the expected JSON format, use this. default: ''

#### Version File

Using the version file strategy requires a file that contains an object literal with a property called version with a string type:

```json
{
  "version": "1.0.0"
}
```

#### `prerelease-branches`

A comma separated list of prerelease identifiers. It will output `should-publish = true`
whenever a pull request is merged to a branch with a name which is a version with one of
the given prerelease-branches identifers. It will also make sure to use the version in
the branch name as part of the outputted `current-version` and use the latest version
that is tagged that is equal to that prerelease version. For instance if a pull request
is merged to the branch `2.0.0-alpha` and the repository has a tag named `2.0.0-alpha.20`
`should-publish` should be `true`, `current-version` should be `2.0.0-alpha.20` and
`release-type` should be prerelease. If there are no tags starting with `2.0.0-alpha`
then that will be the `current-version` output.

### `environment-branch`

If you're releasing things on a branch that represents a specific environment, putting the
branchname in here will consider any merged pull requests to be a pre-release to it.
For instance typical use would be `development`, `testing`, `staging` or similar.
This will cause the `should-publish` output to be set to `true`. The `current-version` output
will include the version number and a `-{branchname}` added to it.
The output `release-type` will be set to `prerelease`.

### Outputs

- `should-publish`: Whether or not the pipeline should publish
- `current-version`: The current version of the repository derived from the tags or 0.0.0 if there are no version tags
- `release-type`: The type of the release. Either major, minor, patch or prerelease

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
        uses: woksin-org/establish-context-action@v2
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
        uses: woksin-org/establish-context-action@v2
        with:
          prerelease-branches: alpha,beta,rc
```

## Contributing

We're always open for contributions and bug fixes!

### Prerequisites

- node <= 12
- yarn
- git
