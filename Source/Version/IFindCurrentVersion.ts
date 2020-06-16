// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Defines a system that can deduce the current version of a repository.
 *
 * @export
 * @interface IFindCurrentVersion
 */
export interface IFindCurrentVersion {

    /**
     * Find the current version of a repository.
     *
     * @returns {Promise<string>}
     */
    find(): Promise<string>
}
