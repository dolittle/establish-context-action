// Copyright (c) woksin-org. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * The context of a build.
 */
export type BuildContext = {
    shouldPublish: boolean,
    currentVersion?: string,
    newVersion?: string,
    releaseType?: string,
    pullRequestBody?: string,
    pullRequestUrl?: string
};
