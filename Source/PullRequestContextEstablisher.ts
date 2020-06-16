// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Context } from '@actions/github/lib/context';
import { BuildContext } from './BuildContext';
import { ICanEstablishContext } from './ICanEstablishContext';
import { GitHub } from '@actions/github/lib/utils';
import { IReleaseTypeExtractor } from './ReleaseType/IReleaseTypeExtractor';
import { IFindCurrentVersion } from './Version/IFindCurrentVersion';
import { ILogger } from '@dolittle/github-actions.shared.logging';

/**
 * Represents an implementation of {ICanEstablishContext}.
 *
 * @export
 * @class PullRequestContextEstablisher
 * @implements {ICanEstablishContext}
 */
export class PullRequestContextEstablisher implements ICanEstablishContext {

    /**
     * Creates an instance of PullRequestContextEstablisher.
     * @param {InstanceType<typeof GitHub>} _github The github REST api.
     */
    constructor(
        private readonly _releaseTypeExtractor: IReleaseTypeExtractor,
        private readonly _currentVersionFinder: IFindCurrentVersion,
        private readonly _github: InstanceType<typeof GitHub>,
        private readonly _logger: ILogger) {
        }
    /**
     * @inheritdoc
     */
    canEstablishFrom(context: Context): boolean {
        return context.payload.pull_request !== undefined
            && context.payload.action !== 'closed';
    }

    /**
     * @inheritdoc
     */
    async establish(context: Context): Promise<BuildContext> {
        if (!this.canEstablishFrom(context)) throw new Error('Cannot establish pull request context');
        this._logger.debug('Establishing context for pull request');
        const pullRequestNumber = context.payload.pull_request?.number;
        if (pullRequestNumber === undefined) {
            this._logger.error('Could not get pull request number');
            throw new Error('Could not get pull request number');
        }
        const {owner, repo} = context.repo;
        const labels = await this._getLabelsFromPullRequest(pullRequestNumber, owner, repo);
        if (!labels || labels.length === 0) return { shouldPublish: false };

        const releaseType = this._releaseTypeExtractor.extract(labels);
        if (releaseType === undefined) return { shouldPublish: false };

        const currentVersion = await this._currentVersionFinder.find();

        return { shouldPublish: false, releaseType, currentVersion };
    }
    private async _getLabelsFromPullRequest(pullRequestNumber: number, owner: string, repo: string) {
        const pullRequest = await this._github.pulls.get(
            {
                owner,
                repo,
                pull_number: pullRequestNumber,
            });
        return pullRequest.data.labels.map(_ => _.name);
    }
}
