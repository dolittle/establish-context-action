// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import semver from 'semver';
import { ILogger } from '@dolittle/github-actions.shared.logging';
import { IFindCurrentVersion } from './IFindCurrentVersion';
import { IVersionSorter } from './IVersionSorter';
import { Context } from '@actions/github/lib/context';
import { GitHub } from '@actions/github/lib/utils';

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
    async find() {
        const {owner, repo} = this._context.repo;
        this._logger.debug(`Getting version tags from github.com/${owner}/${repo}`);
        const versions = await this._getVersionsFromRepoTags(owner, repo);
        if (!versions || versions.length === 0) {
            this._logger.info('No current version can be found. Defaulting to version 1.0.0');
            return '1.0.0';
        }

        const currentVersion = this._versionSorter.sort(versions, true)[0];
        if (!semver.valid(currentVersion)) throw new Error(`${currentVersion} is not a valid SemVer version`);
        this._logger.info(`Found current version '${currentVersion}'`);
        return currentVersion;
    }

    private async _getVersionsFromRepoTags(owner: string, repo: string): Promise<string[]> {
        const versions = await this._github.paginate(
            this._github.repos.listTags,
            {owner, repo},
            (data) => data.data.filter(tag => semver.valid(tag.name)).map(_ => _.name));
        this._logger.debug(`Got version tags: [
${versions.join(',\n')}
]`);
        return versions;
    }
}
