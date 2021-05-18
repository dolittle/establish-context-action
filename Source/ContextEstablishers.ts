// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Context } from '@actions/github/lib/context';
import { BuildContext } from './BuildContext';
import { IContextEstablishers } from './IContextEstablishers';
import { ICanEstablishContext } from './ICanEstablishContext';

/**
 * Represents an implementation of {@link IContextEstablishers}.
 *
 * @export
 * @class ContextEstablishers
 * @implements {IContextEstablishers}
 */
export class ContextEstablishers implements IContextEstablishers {
    private readonly _establishers: ICanEstablishContext[];

    /**
     * Initializes a new instance of {@link ContextEstablishers}
     * @param {ICanEstablishContext[]} establishers The implementations of context establishers to use.
     */
    constructor(...establishers: ICanEstablishContext[]) {
        this._establishers = establishers;
    }

    /**
     * @inheritdoc
     */
    establishFrom(context: Context): Promise<BuildContext> | Promise<undefined> {
        const establisher = this.getEstablisherFor(context);
        return establisher?.establish(context) ?? Promise.resolve(undefined);
    }

    private getEstablisherFor(context: Context): ICanEstablishContext | undefined {
        let establisher: ICanEstablishContext | undefined = undefined;
        for (const _establisher of this._establishers) {
            if (_establisher.canEstablishFrom(context)) {
                if (establisher !== undefined) {
                    throw new Error(`There are multiple context establishers that can establish from context ${context}`);
                }
                establisher = _establisher;
            }
        }
        return establisher;
    }
}
