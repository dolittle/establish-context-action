// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import path from 'path';
import { Context } from '@actions/github/lib/context';
import { ILogger } from '@dolittle/github-actions.shared.logging';
import { CascadingBuild } from '@dolittle/github-actions.shared.rudiments';
import semver, { ReleaseType } from 'semver';
import { BuildContext } from './BuildContext';
import { ICanEstablishContext } from './ICanEstablishContext';
import { IFindCurrentVersion } from './Version/IFindCurrentVersion';

/**
 * Represents an implementation of {ICanEstablishContext}.
 *
 * @export
 * @class CascadingContextEstablisher
 * @implements {ICanEstablishContext}
 */
export class CascadingContextEstablisher implements ICanEstablishContext {

    /**
     * Creates an instance of CascadingContextEstablisher.
     * @param {InstanceType<typeof GitHub>} _github The github REST api.
     */
    constructor(
        private readonly _mainBranch: string,
        private readonly _prereleaseBranches: string[],
        private readonly _currentVersionFinder: IFindCurrentVersion,
        private readonly _logger: ILogger) {
        }
    /**
     * @inheritdoc
     */
    canEstablishFrom(context: Context): boolean {
        const branchName = path.basename(context.ref);
        return context.eventName === 'push'
            && context.payload.head_commit.message.startsWith(CascadingBuild.message)
            && context.payload.pusher.name === CascadingBuild.pusher
            && (branchName === this._mainBranch || this._prereleaseBranches.includes(branchName));
    }

    /**
     * @inheritdoc
     */
    async establish(context: Context): Promise<BuildContext> {
        if (!this.canEstablishFrom(context)) throw new Error('Cannot establish cascading build context');
        this._logger.debug('Establishing context for cascading build');
        const branchName = path.basename(context.ref);
        const prereleaseIdentifier = branchName === this._mainBranch ? undefined : branchName;
        const currentVersion = await this._currentVersionFinder.find(prereleaseIdentifier);
        const currentVersionPrereleaseComponents = currentVersion.prerelease;
        const releaseType: ReleaseType = currentVersionPrereleaseComponents.length > 0 ? 'prerelease' : 'patch';

        return { shouldPublish: true, releaseType, currentVersion: currentVersion.version};
    }
}
