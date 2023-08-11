// Copyright (c) woksin-org. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { SemVer } from 'semver';
import { ILogger } from '@woksin/github-actions.shared.logging';
import { IFindCurrentVersion } from './IFindCurrentVersion';
import { IVersionSorter } from './IVersionSorter';
import { IVersionFetcher } from './IVersionFetcher';

/**
 * Represents an implementation of {@link IFindCurrentVersion} that can get the latest version.
 *
 * @class CurrentVersionFinder
 * @implements {IFindCurrentVersion}
 */
export class CurrentVersionFinder implements IFindCurrentVersion {

    /**
     * Initializes a new instance of {@link CurrentVersionFinder}.
     * @param {IVersionFetcher} _versionFetcher - The version fetcher to use to fetch all released versions.
     * @param {IVersionSorter} _versionSorter - The version sorter to use for sorting versions.
     * @param {ILogger} _logger - The logger to use for logging.
     */
    constructor(
        private readonly _versionFetcher: IVersionFetcher,
        private readonly _versionSorter: IVersionSorter,
        private readonly _logger: ILogger) {}

    /**
     * @inheritdoc
     */
    async find(prereleaseBranch: SemVer | undefined): Promise<SemVer> {
        const versions = await this._versionFetcher.fetchPreviouslyReleasedVersions();
        const sorted = this._versionSorter.sort(versions, true);

        this._logger.debug(`All version tags: [\n${sorted.join(',\n')}\n]`);

        const filtered = this.filterApplicableVersions(sorted, prereleaseBranch);
        this._logger.debug(`Filtered version tags: [\n${filtered.join(',\n')}\n]`);

        if (filtered.length === 0) {
            const defaultVersion = this.getDefaultVersion(prereleaseBranch);
            this._logger.info(`No version tags. Defaulting to version ${defaultVersion.version}`);
            return defaultVersion;
        }

        const currentVersion = filtered[0];
        this._logger.info(`Current version is '${currentVersion}'`);
        return currentVersion;
    }

    private filterApplicableVersions(versions: SemVer[], prereleaseBranch: SemVer | undefined) {
        if (prereleaseBranch === undefined) {
            this._logger.debug('Filtering only non-prerelease versions');
            return versions.filter(_ => _.prerelease.length === 0);
        } else {
            this._logger.debug(`Filtering only versions matching prerelease ${prereleaseBranch}`);
            return versions.filter(_ => _.compareMain(prereleaseBranch) === 0 && _.prerelease.length > 0 && _.prerelease[0] === prereleaseBranch.prerelease[0]);
        }
    }

    private getDefaultVersion(prereleaseBranch: SemVer | undefined): SemVer {
        return prereleaseBranch === undefined
            ? new SemVer('0.0.0')
            : prereleaseBranch;
    }
}
