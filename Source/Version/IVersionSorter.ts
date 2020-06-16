// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

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
     * @param {string[]} versions
     * @param {boolean} [descending]
     * @returns {string[]}
     */
    sort(versions: string[], descending?: boolean): string[]
}
