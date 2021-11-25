# [2.5.2] - 2021-5-18 [PR: #41](https://github.com/dolittle/establish-context-action/pull/41)
## Summary

The main purpose of this PR was to fix an issue we were having when we were releasing fixes while working on a new prerelease in a branch. So for example say we were working on `5.6.0-embeddings` while the latest release was on `5.5.2`. When we merged in a _patch_ to master, the expected new version should be `5.5.3`, but was `5.6.0`.

Factored out the fetching of versions from `CurrentVersionFinder` so that we can write some specs for it, wrote specs, and fixed the implementation. Also cleaned up some documentation to make it all the same (a few different styles floating around), and removed some unused code.

### Added

- `IVersionFetcher` and implementation `GitHubTagsVersionFetcher` using existing code.
- Specifications for `CurrentVersionFinder`

### Fixed

- `CurrentVersionFinder` so that it disregards running prereleases when pulling in a normal release. Also found some other potential small issues that we have not encountered.


