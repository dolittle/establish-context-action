// Copyright (c) woksin-org. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Context } from '@actions/github/lib/context';
import { BuildContext } from './BuildContext';

/**
 * Defines a system that can establish the build context of the Github Action.
 *
 * @interface ICanEstablishContext
 */
export interface ICanEstablishContext {

    /**
     * Whether it can establish from a given context.
     *
     * @param {Context} context - The github {Context}.
     * @returns {[boolean, string | undefined]} Whether it can establish from {Context}.
     */
    canEstablishFrom(context: Context): [boolean, string?]

    /**
     * Establishes a {BuildContext} from the given github {Context}.
     *
     * @param {Context} context - The github context.
     * @returns {Promise<BuildContext>} A {Promise} that, when resolved, returns the {BuildContext}.
     */
    establish(context: Context): Promise<BuildContext>
}
