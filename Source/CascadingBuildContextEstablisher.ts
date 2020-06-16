// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Context } from '@actions/github/lib/context';
import { BuildContext } from './BuildContext';
import { ICanEstablishContext } from './ICanEstablishContext';
import { IFindCurrentVersion } from './Version/IFindCurrentVersion';
import { ILogger } from '@dolittle/github-actions.shared.logging';

export const cascadingBuildMessage = '[Cascading release]';
export const pusher = 'dolittle-build';

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
        private readonly _currentVersionFinder: IFindCurrentVersion,
        private readonly _logger: ILogger) {
        }
    /**
     * @inheritdoc
     */
    canEstablishFrom(context: Context): boolean {
        return context.eventName === 'push'
            && context.payload.commits.length === 1
            && context.payload.commits[0].message.startsWith(cascadingBuildMessage)
            && context.payload.pusher.name === pusher;
    }

    /**
     * @inheritdoc
     */
    async establish(context: Context): Promise<BuildContext> {
        if (!this.canEstablishFrom(context)) throw new Error('Cannot establish cascading build context');
        const releaseType = 'patch';
        const currentVersion = await this._currentVersionFinder.find();
        return { shouldPublish: true, releaseType, currentVersion};
    }
}
