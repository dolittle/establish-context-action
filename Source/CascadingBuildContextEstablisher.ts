// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import path from 'path';
import { Context } from '@actions/github/lib/context';
import { ILogger } from '@dolittle/github-actions.shared.logging';
import { CascadingBuild } from '@dolittle/github-actions.shared.rudiments';
import { BuildContext } from './BuildContext';
import { ICanEstablishContext } from './ICanEstablishContext';
import { IFindCurrentVersion } from './Version/IFindCurrentVersion';

/**
 * Represents an implementation of {@link ICanEstablishContext}.
 *
 * @export
 * @class CascadingContextEstablisher
 * @implements {ICanEstablishContext}
 */
export class CascadingContextEstablisher implements ICanEstablishContext {

    /**
     * Initializes a new instance of {@link CascadingContextEstablisher}
     * @param {IFindCurrentVersion} _currentVersionFinder The current version finder to use for finding the current version.
     * @param {ILogger} _logger The logger to use for logging.
     */
    constructor(
        private readonly _currentVersionFinder: IFindCurrentVersion,
        private readonly _logger: ILogger) { }

    /**
     * @inheritdoc
     */
    canEstablishFrom(context: Context): boolean {
        const branchName = path.basename(context.ref);
        return context.eventName === 'push'
            && context.payload.head_commit.message.startsWith(CascadingBuild.message)
            && context.payload.pusher.name === CascadingBuild.pusher
            && (branchName === 'master' || branchName === 'main');
    }

    /**
     * @inheritdoc
     */
    async establish(context: Context): Promise<BuildContext> {
        if (!this.canEstablishFrom(context)) throw new Error('Cannot establish cascading build context');
        this._logger.debug('Establishing context for cascading build');
        const currentVersion = await this._currentVersionFinder.find(undefined);

        return {
            shouldPublish: true,
            cascadingRelease: true,
            releaseType: 'patch',
            currentVersion: currentVersion.version
        };
    }
}
