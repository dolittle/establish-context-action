// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { getInput, setOutput, setFailed } from '@actions/core';
import { getOctokit, context } from '@actions/github';
import { Logger } from '@dolittle/github-actions.shared.logging';

import {
    CurrentVersionFinder,
    IFindCurrentVersion,
    DefinedVersionFinder,
    SemVerVersionSorter
} from './Version';

import { ReleaseTypeExtractor } from './ReleaseType/ReleaseTypeExtractor';
import { ContextEstablishers } from './ContextEstablishers';
import { CascadingContextEstablisher } from './CascadingBuildContextEstablisher';
import { MergedPullRequestContextEstablisher } from './MergedPullRequestContextEstablisher';
import { BuildContext } from './BuildContext';
import { VersionFromFileVersionFinder } from './Version/VersionFromFileVersionFinder';
import { GitHubTagsVersionFetcher } from './Version/GitHubTagsVersionFetcher';

const logger = new Logger();

run();
export async function run() {
    try {
        const token = getInput('token', { required: true });
        const prereleaseBranches = getInput('prerelease-branches', { required: false })?.split(',') ?? [];
        const currentVersion = getInput('current-version', { required: false }) ?? '';
        const versionFile = getInput('version-file', { required: false }) ?? '';
        const environmentBranch = getInput('environment-branch', { required: false });

        logger.info(`Pushes to branches: [master, main, ${prereleaseBranches.join(', ')}] can trigger a release`);
        const octokit = getOctokit(token);
        const releaseTypeExtractor = new ReleaseTypeExtractor(logger);

        let currentVersionFinder: IFindCurrentVersion;

        logger.info('Inputs:');
        logger.info(` prerelease-branches: '${prereleaseBranches}'`);
        logger.info(` environment-branch: '${environmentBranch}'`);
        logger.info(` currentVersion: '${currentVersion}'`);
        logger.info(` versionFile: '${versionFile}'`);

        if (versionFile.length > 0) {
            logger.info('Using file strategy for finding version');
            currentVersionFinder = new VersionFromFileVersionFinder(versionFile, logger);
        } else if (currentVersion.length > 0) {
            logger.info('Using defined version strategy for finding version');
            currentVersionFinder = new DefinedVersionFinder(currentVersion);
        } else {
            logger.info('Using tag strategy for finding version');
            currentVersionFinder = new CurrentVersionFinder(
                new SemVerVersionSorter(logger),
                new GitHubTagsVersionFetcher(context, octokit, logger),
                logger);
        }

        const contextEstablishers = new ContextEstablishers(
            new CascadingContextEstablisher(currentVersionFinder, logger),
            new MergedPullRequestContextEstablisher(prereleaseBranches, environmentBranch, releaseTypeExtractor, currentVersionFinder, octokit, logger)
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

function output(
    shouldPublish: boolean,
    cascadingRelease: boolean,
    currentVersion?: string,
    releaseType?: string,
    prBody?: string,
    prUrl?: string) {
    logger.info('Outputting: ');
    logger.info(`'should-publish': ${shouldPublish}`);
    logger.info(`'cascading-release': ${cascadingRelease}`);
    logger.info(`'current-version': ${currentVersion}`);
    logger.info(`'release-type': ${releaseType}`);
    logger.info(`'pr-body': ${prBody}`);
    logger.info(`'pr-url': ${prUrl}`);

    setOutput('should-publish', shouldPublish);
    setOutput('cascading-release', cascadingRelease);
    setOutput('current-version', currentVersion ?? '');
    setOutput('release-type', releaseType ?? '');
    setOutput('pr-body', prBody ?? '');
    setOutput('pr-url', prUrl ?? '');
}
function outputContext(context: BuildContext) {
    output(
        context.shouldPublish,
        context.cascadingRelease,
        context.currentVersion,
        context.releaseType,
        context.pullRequestBody,
        context.pullRequestUrl);
}

function outputDefault() {
    output(false, false);
}

function fail(error: Error) {
    logger.error(error.message);
    setFailed(error.message);
}

