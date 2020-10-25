// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { SemVer } from 'semver';
import { IFindCurrentVersion } from './IFindCurrentVersion';
import * as fs from 'fs';

/**
 * Represents an implementation of {@link IFindCurrentVersion} that reads version information from a file.
 */
export class VersionFromFileVersionFinder implements IFindCurrentVersion {

    /**
     * Initializes a new instance of {@link VersionFromFileVersionFinder}.
     * @param {string} _file Path to JSON file to read from.
     */
    constructor(private readonly _file: string) { }

    /** @inheritdoc */
    find(prereleaseBranch: SemVer | undefined): Promise<SemVer> {
        return new Promise(async (resolve) => {
            try {
                if (fs.existsSync(this._file)) {
                    const content = await fs.promises.readFile(this._file);
                    const contentAsString = content.toString();
                    const versionInfo = JSON.parse(contentAsString);
                    resolve(new SemVer(versionInfo.version));
                } else {
                    resolve(new SemVer('1.0.0'));
                }
            } catch (e) {
                resolve(new SemVer('1.0.0'));
            }
        });
    }

}
