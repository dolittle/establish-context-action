// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { SemVer } from 'semver';

/**
 * Defines a system that can deduce the current version of a repository.
 *
 * @interface IFindCurrentVersion
 */
export interface IFindCurrentVersion {

    /**
     * Find the current version of a repository.
     *
     * @returns {Promise<SemVer>}
     */
    find(prereleaseBranch: SemVer | undefined): Promise<SemVer>
}
