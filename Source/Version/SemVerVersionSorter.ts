// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ILogger } from '@dolittle/github-actions.shared.logging';
import semver from 'semver';
import { IVersionSorter } from './IVersionSorter';

/**
 * Represents an implementation of {IVersionSorter} that can sort versions according to SemVer
 *
 * @export
 * @class SemVerVersionSorter
 * @implements {IVersionSorter}
 */
export class SemVerVersionSorter implements IVersionSorter {

    /**
     * Instantiates an instance of {SemVerVersionSorter}.
     * @param {ILogger} _logger
     */
    constructor(private _logger: ILogger ) {}

    /**
     * @inheritdoc
     */
    sort(versions: string[], descending: boolean = true) {
        this._logger.debug('Sorting versions...');
        if (versions === undefined) return [];
        versions.forEach(_ => {
            if (!semver.valid(_)) throw new Error(`${_} is not a valid SemVer version`);
        });
        return descending ? semver.rsort(versions) : semver.sort(versions);
    }

}
