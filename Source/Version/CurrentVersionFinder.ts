// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import semver, { SemVer } from 'semver';
import { ILogger } from '@dolittle/github-actions.shared.logging';
import { IFindCurrentVersion } from './IFindCurrentVersion';
import { IVersionSorter } from './IVersionSorter';
import { IVersionFetcher } from './IVersionFetcher';

/**
 * Represents an implementation of {ICanGetLatestVersion} that can get the latest version from Github
 *
 * @export
 * @class GithubLatestVersionFinder
 * @implements {ICanGetLatestVersion}
 */
export class CurrentVersionFinder implements IFindCurrentVersion {

    /**
     * Instantiates an instance of {GithubVersionTags}.
     */
    constructor(
        private readonly _versionSorter: IVersionSorter,
        private readonly _versionFetcher: IVersionFetcher,
        private readonly _logger: ILogger) {}

    /**
     * @inheritdoc
     */
    async find(prereleaseBranch: SemVer | undefined): Promise<SemVer> {
        const versions = await this._versionFetcher.fetchPreviouslyReleasedVersions();
        if (!versions || versions.length === 0) {
            const defaultVersion = new SemVer('0.0.0');
            this._logger.info(`No version tags. Defaulting to version ${defaultVersion.version}`);
            return defaultVersion;
        }

        this._logger.debug(`Version tags: [
${versions.join(',\n')}
]`);

        const currentVersion = this._findGreatestMatchingVersion(this._versionSorter.sort(versions, true), prereleaseBranch);
        this._logger.info(`Current version '${currentVersion}'`);
        return currentVersion;
    }

    private _findGreatestMatchingVersion(versionsDescending: SemVer[], prereleaseBranch: SemVer | undefined) {
        if (prereleaseBranch === undefined) {
            const greatestVersion = versionsDescending[0];
            this._logger.debug(`Not searching for prerelease. Returning greatest version ${greatestVersion}`);
            return greatestVersion;
        }

        const prereleaseId = prereleaseBranch.prerelease[0];
        this._logger.debug(`Searching for version with the greatest build number of prerelease ${prereleaseBranch}`);
        for (const version of versionsDescending) {
            this._logger.debug(`Checking version ${version}`);
            if (semver.gt(prereleaseBranch, version)) {
                this._logger.debug(`${prereleaseBranch} is greater than ${version}. Defaulting to ${prereleaseBranch}`);
                return prereleaseBranch;
            }
            const versionPrerelease = version.prerelease;
            if (versionPrerelease === null || versionPrerelease.length === 0)
            {
                this._logger.debug(`${version} is not a prerelease version. Skipping`);
                continue;
            }
            if (prereleaseBranch.compareMain(version) === 0) {
                this._logger.debug(`${prereleaseBranch} and ${version} match`);
                return version;
            }
        }
        return prereleaseBranch;
    }
}
