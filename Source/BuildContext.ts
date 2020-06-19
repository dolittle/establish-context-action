// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * The context of a build.
 */
export type BuildContext = {
    shouldPublish: boolean,
    cascadingRelease: boolean,
    currentVersion?: string,
    releaseType?: string,
    prereleaseId?: string
};
