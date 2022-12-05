// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ILogger } from '@dolittle/github-actions.shared.logging';
import semver, { SemVer } from 'semver';
import { IVersionSorter } from './IVersionSorter';

/**.
 * Represents an implementation of {@link IVersionSorter} that can sort versions according to SemVer
 *
 * @export
 * @class SemVerVersionSorter
 * @implements {IVersionSorter}
 */
export class SemVerVersionSorter implements IVersionSorter {

    /**
     * Initializes a new instance of {@link SemVerVersionSorter}.
     * @param {ILogger} _logger - The logger to use for logging.
     */
    constructor(private _logger: ILogger) {}

    /**
     * @inheritdoc
     */
    sort(versions: SemVer[], descending: boolean = true) {
        this._logger.debug('Sorting versions...');
        if (versions === undefined) return [];
        versions.forEach(_ => {
            if (!semver.valid(_)) throw new Error(`${_} is not a valid SemVer version`);
        });
        return descending ? semver.rsort(versions) : semver.sort(versions);
    }
}
