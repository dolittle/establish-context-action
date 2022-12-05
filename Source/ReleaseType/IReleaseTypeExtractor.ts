// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ReleaseType } from 'semver';

/**.
 * Defines a system that can extract a release type from a list of labels
 *
 * @export
 * @interface IReleaseTypeExtractor
 */
export interface IReleaseTypeExtractor {

    /**.
     * Extracts a release type from a list of labels
     *
     * @param {string[]} labels
     * @returns {ReleaseType | undefined}
     */
    extract(labels: string[]): ReleaseType | undefined
}
