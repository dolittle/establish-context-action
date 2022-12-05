// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { SemVer } from 'semver';

/**
 * Defines a system that can fetch versions.
 *
 * @interface IVersionFetcher
 */
export interface IVersionFetcher {

    /**
     * Fetches all previously released versions.
     *
     * @returns {SemVer[] | Promise<SemVer[]>}
     */
    fetchPreviouslyReleasedVersions(): SemVer[] | Promise<SemVer[]>;
}
