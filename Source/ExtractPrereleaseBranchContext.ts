// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import path from 'path';
import semver from 'semver';
import { IExtractPrereleaseBranchContext } from './IExtractPrereleaseBranchContext';
import { PrereleaseBranchContext } from './PrereleaseBranchContext';
import { ILogger } from '@dolittle/github-actions.shared.logging';

/**
 * Represents an implementation of {IExtractPrereleaseBranchContext}
 *
 * @export
 * @class ExtractPrereleaseBranchContext
 * @implements {IExtractPrereleaseBranchContext}
 */
export class ExtractPrereleaseBranchContext implements IExtractPrereleaseBranchContext {

    constructor(private readonly _releaseBranches: string[], private readonly _logger: ILogger) {
    }
    /**
     * @inheritdoc
     */
    extract(ref: string): PrereleaseBranchContext | undefined {
        this._logger.debug(`Extracting prerelease branch context from ref ${ref}`);
        const branchName = path.basename(ref);
        this._logger.debug(`branch name: '${ref}'`);
        const version = semver.parse(branchName);
        if (version === undefined || version === null) {
            this._logger.debug(`'${ref}' is not a release branch`);
            return undefined;
        }

        const prereleaseComponents = version.prerelease;
        if (prereleaseComponents.length === 0) {
            this._logger.warning(`'${ref}' does not have a prerelease identifier`);
            return undefined;
        }

        const prereleaseLabel = prereleaseComponents[0]  as string;
        if (!this._releaseBranches.includes(prereleaseLabel)) {
            this._logger.warning(`'${ref}' is not one of the configured release branches: [${this._releaseBranches.join(', ')}]`);
            return undefined;
        }

        const versionWithoutPrerelease = version.inc('patch');
        const context = {version, prereleaseLabel, versionWithoutPrerelease};
        this._logger.debug(`'${ref}' ==> ${context}`);
        return context;
    }
}
