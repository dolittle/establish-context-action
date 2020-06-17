// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import path from 'path';
import { Context } from '@actions/github/lib/context';
import { GitHub } from '@actions/github/lib/utils';
import { ILogger } from '@dolittle/github-actions.shared.logging';
import { BuildContext } from './BuildContext';
import { ICanEstablishContext } from './ICanEstablishContext';
import { IReleaseTypeExtractor } from './ReleaseType/IReleaseTypeExtractor';
import { IFindCurrentVersion } from './Version/IFindCurrentVersion';
import { IExtractPrereleaseBranchContext } from './IExtractPrereleaseBranchContext';

/**
 * Represents an implementation of {ICanEstablishContext}.
 *
 * @export
 * @class MergedPullRequestContextEstablisher
 * @implements {ICanEstablishContext}
 */
export class MergedPullRequestContextEstablisher implements ICanEstablishContext {

    /**
     * Creates an instance of MergedPullRequestContextEstablisher.
     * @param {InstanceType<typeof GitHub>} _github The github REST api.
     */
    constructor(
        private readonly _releaseBranches: string[],
        private readonly _releaseTypeExtractor: IReleaseTypeExtractor,
        private readonly _prereleaseBranchContextExtractor: IExtractPrereleaseBranchContext,
        private readonly _currentVersionFinder: IFindCurrentVersion,
        private readonly _github: InstanceType<typeof GitHub>,
        private readonly _logger: ILogger) {
        }
    /**
     * @inheritdoc
     */
    canEstablishFrom(context: Context): boolean {
        return context.payload.pull_request !== undefined
            && context.payload.action === 'closed'
            && context.payload.pull_request?.merged
            && this._releaseBranches.includes(path.basename(context.ref));
    }

    /**
     * @inheritdoc
     */
    async establish(context: Context): Promise<BuildContext> {
        if (!this.canEstablishFrom(context)) throw new Error('Cannot establish merged pull request context');
        this._logger.debug('Establishing context for merged pull build');
        const {owner, repo} = context.repo;
        const mergedPr = await this._getMergedPr(owner, repo, context.sha);
        if (!mergedPr) {
            const message = `Could not find a merged pull request with the merge_commit_sha ${context.sha}`;
            this._logger.error(message);
            throw new Error(message);
        }
        const releaseType = this._releaseTypeExtractor.extract(mergedPr?.labels.map(_ => _.name));
        if (!releaseType) return { shouldPublish: false };
        const prereleaseContext = this._prereleaseBranchContextExtractor.extract(context.ref);
        const currentVersion = await this._currentVersionFinder.find(prereleaseContext);
        return { shouldPublish: true, releaseType, currentVersion: currentVersion.version};
    }

    private async _getMergedPr(owner: string, repo: string, sha: string) {
        this._logger.debug(`Trying to get merged PR with merge_commit_sha: ${sha}`);
        const mergedPr = await this._github.paginate(
            this._github.pulls.list,
            { owner, repo, state: 'closed', sort: 'updated', direction: 'desc' }
        ).then(data => data.find(pr => pr.merge_commit_sha === sha));
        return mergedPr;
    }
}
