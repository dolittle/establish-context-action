// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import semver, { SemVer } from 'semver';
import { ILogger } from '@dolittle/github-actions.shared.logging';
import { Context } from '@actions/github/lib/context';
import { GitHub } from '@actions/github/lib/utils';
import { IVersionFetcher } from './IVersionFetcher';

/**
 * Represents an implementation of {IVersionFetcher} that can versions from GitHhub tags
 *
 * @export
 * @class GitHubTagsVersionFetcher
 * @implements {IVersionFetcher}
 */
export class GitHubTagsVersionFetcher implements IVersionFetcher {

    /**
     * Instantiates an instance of {GitHubTagsVersionFetcher}.
     */
     constructor(
        private readonly _context: Context,
        private readonly _github: InstanceType<typeof GitHub>,
        private readonly _logger: ILogger) {}

    async fetchPreviouslyReleasedVersions(): Promise<SemVer[]> {
        const {owner, repo} = this._context.repo;
        this._logger.debug(`Getting version tags from github.com/${owner}/${repo}`);

        const versions = await this._github.paginate(
            this._github.repos.listTags,
            {owner, repo},
            response => response.data
                                    .filter(tag => semver.valid(tag.name))
                                    .map(_ => _.name!));

        return versions.map(_ => semver.parse(_)!);
    }
}
