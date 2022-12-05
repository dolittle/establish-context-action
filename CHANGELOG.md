# [2.5.4] - 2022-12-5 [PR: #53](https://github.com/dolittle/establish-context-action/pull/53)
## Summary
Update dependencies and use latest dolittle typescript packages


# [2.5.3] - 2021-11-25 [PR: #45](https://github.com/dolittle/establish-context-action/pull/45)
## Summary

Trims the spaces around prerelease branch names after splitting on comma to allow specifying:
```yaml
     - name: Establish context
        id: context
        uses: dolittle/establish-context-action@v2
        with:
          prerelease-branches: legolas, gandalf
```
instead of:
```yaml
     - name: Establish context
        id: context
        uses: dolittle/establish-context-action@v2
        with:
          prerelease-branches: legolas,gandalf
```

### Fixed

- Trim spaces around prerelease branch names


# [2.5.2] - 2021-5-18 [PR: #41](https://github.com/dolittle/establish-context-action/pull/41)
## Summary

The main purpose of this PR was to fix an issue we were having when we were releasing fixes while working on a new prerelease in a branch. So for example say we were working on `5.6.0-embeddings` while the latest release was on `5.5.2`. When we merged in a _patch_ to master, the expected new version should be `5.5.3`, but was `5.6.0`.

Factored out the fetching of versions from `CurrentVersionFinder` so that we can write some specs for it, wrote specs, and fixed the implementation. Also cleaned up some documentation to make it all the same (a few different styles floating around), and removed some unused code.

### Added

- `IVersionFetcher` and implementation `GitHubTagsVersionFetcher` using existing code.
- Specifications for `CurrentVersionFinder`

### Fixed

- `CurrentVersionFinder` so that it disregards running prereleases when pulling in a normal release. Also found some other potential small issues that we have not encountered.


