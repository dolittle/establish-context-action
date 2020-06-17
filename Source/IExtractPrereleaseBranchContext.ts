// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { PrereleaseBranchContext } from './PrereleaseBranchContext';

/**
 * Defines a system that can extract the prerelease branch context from the ref.
 *
 * @export
 * @interface IExtractPrereleaseBranchContext
 */
export interface IExtractPrereleaseBranchContext {

    /**
     * Extract {PrereleaseBranchContext} from the {Context}.
     *
     * @param {string} ref
     * @returns {(PrereleaseBranchContext | undefined)}
     */
    extract(ref: string): PrereleaseBranchContext | undefined;
}
