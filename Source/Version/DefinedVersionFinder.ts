// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { SemVer } from 'semver';
import { IFindCurrentVersion } from './IFindCurrentVersion';

/**
 * Represents an implementation of {@link IFindCurrentVersion} that uses a version defined from somewhere.
 */
export class DefinedVersionFinder implements IFindCurrentVersion {

    /**
     * Initializes a new instance of {@link DefinedVersionFinder}
     * @param {string} version The defined version as a string
     */
    constructor(private readonly _version: string) { }

    /** @inheritdoc */
    find(): Promise<SemVer> {
        const promise = new Promise<SemVer>((resolve) => {
            let currentVersion: SemVer;

            if (this._version.length === 0) {
                currentVersion = new SemVer('0.0.0');
            } else {
                currentVersion = new SemVer(this._version);
            }

            resolve(currentVersion);
        });

        return promise;
    }
}
