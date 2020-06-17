// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { SemVer } from 'semver';

/**
 * The context of a prerelease branch.
 */
export type PrereleaseBranchContext = {
    version: SemVer,
    prereleaseLabel: string,
    versionWithoutPrerelease: SemVer
};
