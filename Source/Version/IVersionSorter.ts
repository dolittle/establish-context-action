// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { SemVer } from 'semver';

/**
 * Defines a system that can sort versions.
 *
 * @export
 * @interface IVersionSorter
 */
export interface IVersionSorter {

    /**
     * Sorts a list of versions.
     *
     * @param {SemVer[]} versions
     * @param {boolean} [descending]
     * @returns {SemVer[]}
     */
    sort(versions: SemVer[], descending?: boolean): SemVer[]
}
