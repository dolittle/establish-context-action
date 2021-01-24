// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import path from 'path';
import semver from 'semver';
import { Context } from '@actions/github/lib/context';
import { GitHub } from '@actions/github/lib/utils';
import { ILogger } from '@dolittle/github-actions.shared.logging';
import { BuildContext } from './BuildContext';
import { ICanEstablishContext } from './ICanEstablishContext';
import { IReleaseTypeExtractor } from './ReleaseType/IReleaseTypeExtractor';
import { IFindCurrentVersion } from './Version/IFindCurrentVersion';

const nonPrereleaseLabels = [
    'major',
    'minor',
    'patch'
];

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
        private readonly _prereleaseBranches: string[],
        private readonly _environmentBranch: string,
        private readonly _releaseTypeExtractor: IReleaseTypeExtractor,
        private readonly _currentVersionFinder: IFindCurrentVersion,
        private readonly _github: InstanceType<typeof GitHub>,
        private readonly _logger: ILogger) {
    }
    /**
     * @inheritdoc
     */
    canEstablishFrom(context: Context): boolean {
        const branchName = path.basename(context.ref);
        return context.payload.pull_request !== undefined
            && context.payload.action === 'closed'
            && context.payload.pull_request?.merged
            && (branchName === 'master' ||
                branchName === 'main' ||
                branchName === this._environmentBranch ||
                this._isPrereleaseBranch(branchName));
    }

    /**
     * @inheritdoc
     */
    async establish(context: Context): Promise<BuildContext> {
        if (!this.canEstablishFrom(context)) throw new Error('Cannot establish merged pull request context');
        this._logger.info('Establishing context for merged pull build');
        const { owner, repo } = context.repo;
        const mergedPr = await this._getMergedPr(owner, repo, context.sha);
        if (!mergedPr) {
            throw new Error(`Could not find a merged pull request with the merge_commit_sha ${context.sha}`);
        }

        const branchName = path.basename(context.ref);
        let prereleaseBranch = (branchName === 'master' || branchName === 'main') ? undefined : semver.parse(branchName)!;
        let currentVersion = await this._currentVersionFinder.find(prereleaseBranch);
        if (branchName === this._environmentBranch) {
            if (currentVersion.prerelease.length > 0 && currentVersion.prerelease[0].toString() !== this._environmentBranch) {
                prereleaseBranch = semver.parse(`${currentVersion.major}.${currentVersion.minor}.${currentVersion.patch}-${branchName}`)!;
                currentVersion = prereleaseBranch;
            } else {
                prereleaseBranch = currentVersion;
            }
        }

        this._logger.info(`Using version '${currentVersion.version}'`);

        const labels = mergedPr?.labels.map(_ => _.name);
        this._logger.info(`PR has the following labels: '${labels}'`);

        const releaseType = prereleaseBranch !== undefined ?
            'prerelease'
            : this._releaseTypeExtractor.extract(labels);
        if (releaseType === undefined) {
            this._logger.info('Found no release type label on pull request');
            return {
                shouldPublish: false,
                cascadingRelease: false,
                pullRequestBody: mergedPr.body,
                pullRequestUrl: mergedPr.html_url,
            };
        }
        if (prereleaseBranch === undefined && !nonPrereleaseLabels.includes(releaseType)) {
            throw new Error(`When merging to master/main with a release type label it should be one of [${nonPrereleaseLabels.join(', ')}]`);
        }
        return {
            shouldPublish: true,
            cascadingRelease: false,
            releaseType,
            currentVersion: currentVersion.version,
            pullRequestBody: mergedPr.body,
            pullRequestUrl: mergedPr.html_url
        };
    }

    private async _getMergedPr(owner: string, repo: string, sha: string) {
        this._logger.debug(`Trying to get merged PR with merge_commit_sha: ${sha}`);
        const mergedPr = await this._github.paginate(
            this._github.pulls.list,
            { owner, repo, state: 'closed', sort: 'updated', direction: 'desc' }
        ).then(data => data.find(pr => pr.merge_commit_sha === sha));
        return mergedPr;
    }

    private _isPrereleaseBranch(branchName: string) {
        const branchAsSemver = semver.parse(branchName);
        if (branchAsSemver === null) {
            this._logger.debug(`Branch: '${branchName}' is not a prerelease branch`);
            return false;
        }
        const prerelease = branchAsSemver.prerelease;
        if (!prerelease || prerelease.length === 0) {
            this._logger.debug(`Branch: '${branchName}' is not a prerelease branch`);
            return false;
        }
        const prereleaseId = prerelease[0];
        this._logger.debug(`Checking if configured prerelease branch for prerelease id ${prereleaseId}`);
        for (const prereleaseBranch of this._prereleaseBranches) {
            if (prereleaseId === prereleaseBranch) return true;
        }
        return false;
    }
}
