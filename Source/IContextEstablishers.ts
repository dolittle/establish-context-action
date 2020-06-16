// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Context } from '@actions/github/lib/context';
import { BuildContext } from './BuildContext';

/**
 * Defines a system that knows about {ICanEstablishContext} implementations.
 *
 * @export
 * @interface IContextEstablishers
 */

export interface IContextEstablishers {

    /**
     * Establishes a {BuildContext} from the given github {Context}.
     *
     * @param {Context} context The github context.
     * @param {InstanceType<typeof GitHub>} github The github REST api.
     * @returns {Promise<BuildContext>} A {Promise} that, when resolved, returns the {BuildContext}.
     */
    establishFrom(context: Context): Promise<BuildContext> | Promise<undefined>;
}
