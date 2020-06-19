// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as core from '@actions/core';
import * as github from '@actions/github';
import { Logger } from '@dolittle/github-actions.shared.logging';
import { CurrentVersionFinder } from './Version/CurrentVersionFinder';
import { ReleaseTypeExtractor } from './ReleaseType/ReleaseTypeExtractor';
import { SemVerVersionSorter } from './Version/SemVerVersionSorter';
import { ContextEstablishers } from './ContextEstablishers';
import { CascadingContextEstablisher } from './CascadingBuildContextEstablisher';
import { MergedPullRequestContextEstablisher } from './MergedPullRequestContextEstablisher';
import { BuildContext } from './BuildContext';

const logger = new Logger();

run();
export async function run() {
    try {
        const context = github.context;
        const token = core.getInput('token', { required: true });
        const mainBranch = core.getInput('main-branch', { required: true });
        const releaseBranches = core.getInput('prerelease-branches', { required: false })?.split(',') ?? [];
        logger.info(`Pushes to branches: [${releaseBranches.join(', ')}] can trigger a release`);
        const octokit = github.getOctokit(token);
        const releaseTypeExtractor = new ReleaseTypeExtractor(logger);
        const currentVersionFinder = new CurrentVersionFinder(
            new SemVerVersionSorter(logger),
            context,
            octokit,
            logger);
        const contextEstablishers = new ContextEstablishers(
            new CascadingContextEstablisher(mainBranch, releaseBranches, currentVersionFinder, logger),
            new MergedPullRequestContextEstablisher(mainBranch, releaseBranches, releaseTypeExtractor, currentVersionFinder, octokit, logger)
        );
        logger.info('Establishing context');
        const buildContext = await contextEstablishers.establishFrom(context);
        if (buildContext === undefined) {
            logger.debug('No establisher found for context');
            logger.debug(JSON.stringify(context, undefined, 2));
            outputDefault();
        }
        else outputContext(buildContext);

    } catch (error) {
        fail(error);
    }
}

function output(shouldPublish: boolean, cascadingRelease: boolean, currentVersion?: string, releaseType?: string, prereleaseId?: string) {
    logger.info('Outputting: ');
    logger.info(`'should-publish': ${shouldPublish}`);
    logger.info(`'cascading-release': ${cascadingRelease}`);
    logger.info(`'current-version': ${currentVersion}`);
    logger.info(`'release-type': ${releaseType}`);
    logger.info(`'prerelease-id': ${prereleaseId}`);
    core.setOutput('should-publish', shouldPublish);
    core.setOutput('cascading-release', cascadingRelease);
    core.setOutput('current-version', currentVersion ?? '');
    core.setOutput('release-type', releaseType ?? '');
    core.setOutput('prerelease-id', prereleaseId ?? '');
}
function outputContext(context: BuildContext) {
    output(context.shouldPublish, context.cascadingRelease, context.currentVersion, context.releaseType, context.prereleaseId);
}

function outputDefault() {
    output(false, false);
}

function fail(error: Error) {
    logger.error(error.message);
    core.setFailed(error.message);
}
