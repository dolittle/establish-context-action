// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import semver, { SemVer } from 'semver';
import { ILogger } from '@dolittle/github-actions.shared.logging';
import { Context } from '@actions/github/lib/context';
import { GitHub } from '@actions/github/lib/utils';
import { IFindCurrentVersion } from './IFindCurrentVersion';
import { IVersionSorter } from './IVersionSorter';

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
    constructor(private readonly _versionSorter: IVersionSorter, private readonly _context: Context, private readonly _github: InstanceType<typeof GitHub> , private readonly _logger: ILogger) {}

    /**
     * @inheritdoc
     */
    async find(prereleaseIdentifier?: string): Promise<SemVer> {
        const {owner, repo} = this._context.repo;
        this._logger.debug(`Getting version tags from github.com/${owner}/${repo}${prereleaseIdentifier !== undefined ? ` with prerelease identifier '${prereleaseIdentifier}'` : ''}`);
        let versions = await this._getVersionsFromRepoTags(owner, repo);
        if (!versions || versions.length === 0) {
            const defaultVersion = this._getDefaultVersion(prereleaseIdentifier);
            this._logger.info(`No version tags. Defaulting to version ${defaultVersion}`);
            return defaultVersion;
        }

        if (prereleaseIdentifier !== undefined) {
            versions = versions.filter(_ => _.prerelease.length > 0 && _.prerelease[0] === prereleaseIdentifier);
            if (versions.length === 0) {
                const defaultVersion = this._getDefaultVersion(prereleaseIdentifier);
                this._logger.info(`No version tag with prerelease identifier '${prereleaseIdentifier}' was found. Defaulting to version ${defaultVersion}`);
                return defaultVersion;
            }
        }

        const currentVersion = this._versionSorter.sort(versions, true)[0];
        if (!semver.valid(currentVersion)) throw new Error(`${currentVersion} is not a valid SemVer version`);
        this._logger.info(`Found current version '${currentVersion}'`);
        return currentVersion;
    }

    private async _getVersionsFromRepoTags(owner: string, repo: string): Promise<SemVer[]> {
        const versions = await this._github.paginate(
            this._github.repos.listTags,
            {owner, repo},
            response => response.data
                                    .filter(tag => semver.valid(tag.name))
                                    .map(_ => _.name!));
        this._logger.debug(`Got version tags: [
${versions.join(',\n')}
]`);
        return versions.map(_ => semver.parse(_)!);
    }

    private _getDefaultVersion(prereleaseIdentifier?: string): SemVer {
        if (prereleaseIdentifier === undefined) return new SemVer('1.0.0');
        return new SemVer(`1.0.0-${prereleaseIdentifier}.0`);
    }
}
