// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Context } from '@actions/github/lib/context';
import { BuildContext } from './BuildContext';

/**
 * Defines a system that knows about {@link ICanEstablishContext} implementations.
 *
 * @export
 * @interface IContextEstablishers
 */

export interface IContextEstablishers {

    /**
     * Establishes a {@link BuildContext} from the given github {@link Context}.
     *
     * @param {Context} context The GitHub context.
     * @param {InstanceType<typeof GitHub>} github The GitHub REST api.
     * @returns {Promise<BuildContext>} A {@link Promise} that, when resolved, returns the {@link BuildContext}.
     */
    establishFrom(context: Context): Promise<BuildContext> | Promise<undefined>;
}
