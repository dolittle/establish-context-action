// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ReleaseType } from 'semver';
import { ILogger } from '@dolittle/github-actions.shared.logging';
import { IReleaseTypeExtractor } from './IReleaseTypeExtractor';

const prioritizedReleaseTypes: ReleaseType[] = [
    'major',
    'minor',
    'patch',
    'premajor',
    'preminor',
    'prepatch',
    'prerelease'
];

/**
 * Represents an implementation of {IReleaseTypeExtractor}
 *
 * @export
 * @class ReleaseTypeExtractor
 * @implements {IReleaseTypeExtractor}
 */
export class ReleaseTypeExtractor implements IReleaseTypeExtractor {

    /**
     * Creates an instance of ReleaseTypeExtractor.
     * @param {ILogger} _logger The logger to use for logging.
     */
    constructor(private _logger: ILogger) {}

    /**
     * @inheritdoc
     */
    extract(labels: string[]): ReleaseType | undefined {
        if (labels === undefined) return undefined;
        this._logger.debug(`Extracting release type from list of labels: [${labels.join(', ')}]`);
        labels = labels.map(_ => _.trim());
        for (const releaseType of prioritizedReleaseTypes) {
            const foundReleaseType = labels.find(_ => _ === releaseType) as ReleaseType | undefined;
            if (foundReleaseType !== undefined) return foundReleaseType;
        }
        return undefined;
    }
}
