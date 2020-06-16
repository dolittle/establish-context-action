// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ReleaseType } from 'semver';
import { ILogger } from '@dolittle/github-actions.shared.logging';
import { IReleaseTypeExtractor } from './IReleaseTypeExtractor';

const major = 'major';
const minor = 'minor';
const patch = 'patch';
const prereleaseLabels = ['prerelease', 'preview'];
const prerelease = 'prerelease';
/**
 * Represents an implementation of {IReleaseTypeExtractor}
 *
 * @export
 * @class ReleaseTypeExtractor
 * @implements {IReleaseTypeExtractor}
 */
export class ReleaseTypeExtractor implements IReleaseTypeExtractor {

    /**
     * Instantiating an instance of {ReleaseTypeExtractor}.
     * @param {ILogger} _logger
     */
    constructor(private _logger: ILogger) {}

    /**
     * @inheritdoc
     */
    extract(labels: string[]): ReleaseType | undefined {
        if (labels === undefined) return undefined;
        this._logger.debug(`Extracting release type from list of labels: [${labels.join(', ')}]`);
        labels = labels.map(_ => _.trim());

        if (labels.includes(major)) return major;
        if (labels.includes(minor)) return minor;
        if (labels.includes(patch)) return patch;
        if (labels.find(item => prereleaseLabels.includes(item)) !== undefined) return prerelease;
        return undefined;
    }

}
