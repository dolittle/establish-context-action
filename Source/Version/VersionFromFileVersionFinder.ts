// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { SemVer } from 'semver';
import { IFindCurrentVersion } from './IFindCurrentVersion';
import { ILogger } from '@dolittle/github-actions.shared.logging';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Represents an implementation of {@link IFindCurrentVersion} that reads version information from a file.
 */
export class VersionFromFileVersionFinder implements IFindCurrentVersion {

    /**
     * Initializes a new instance of {@link VersionFromFileVersionFinder}.
     * @param {string} _file Path to JSON file to read from.
     */
    constructor(private readonly _file: string, private readonly _logger: ILogger) { }

    /** @inheritdoc */
    async find(prereleaseBranch: SemVer | undefined): Promise<SemVer> {
        const defaultVersion = new SemVer('1.0.0');
        try {
            const absolutePath = path.resolve(this._file);

            if (fs.existsSync(absolutePath)) {
                const content = await fs.promises.readFile(absolutePath);
                const contentAsString = content.toString();
                const versionInfo = JSON.parse(contentAsString);
                this._logger.info(`Version from file: ${versionInfo.version}`);
                return new SemVer(versionInfo.version);
            } else {
                this._logger.info('Version file does not exist - returning default version');
                return defaultVersion;
            }
        } catch (e) {
            this._logger.info(`Problems getting version from file '${e}'`);
            return defaultVersion;
        }
    }
}
