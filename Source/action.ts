// Copyright (c) woksin-org. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { getInput, setOutput, setFailed, getMultilineInput } from '@actions/core';
import { getOctokit, context } from '@actions/github';
import { Logger } from '@woksin/github-actions.shared.logging';

import {
    CurrentVersionFinder,
    IFindCurrentVersion,
    DefinedVersionFinder,
    SemVerVersionSorter,
    VersionIncrementor
} from './Version';

import { ReleaseTypeExtractor } from './ReleaseType/ReleaseTypeExtractor';
import { MergedPullRequestContextEstablisher } from './MergedPullRequestContextEstablisher';
import { BuildContext } from './BuildContext';
import { VersionFromFileVersionFinder } from './Version/VersionFromFileVersionFinder';
import { GitHubTagsVersionFetcher } from './Version/GitHubTagsVersionFetcher';

const logger = new Logger();

run();
/**
 * Runs the action.
 */
export async function run() {
    try {
        const token = getInput('token', { required: true });
        const releaseBranches = getMultilineInput('release-branches', { required: false }) ?? [];
        const prereleaseBranches = getMultilineInput('prerelease-branches', { required: false }) ?? [];
        const currentVersion = getInput('current-version', { required: false }) ?? '';
        const versionFile = getInput('version-file', { required: false }) ?? '';
        const environmentBranch = getInput('environment-branch', { required: false });

        logger.info(`Pushes to branches: [${releaseBranches.concat(prereleaseBranches).join(', ')}] can trigger a release`);
        const octokit = getOctokit(token);
        const releaseTypeExtractor = new ReleaseTypeExtractor(logger);

        let currentVersionFinder: IFindCurrentVersion;

        logger.info('Inputs:');
        logger.info(` release-branches: '${releaseBranches}'`);
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
                new GitHubTagsVersionFetcher(context, octokit, logger),
                new SemVerVersionSorter(logger),
                logger);
        }

        const contextEstablisher = new MergedPullRequestContextEstablisher(releaseBranches, prereleaseBranches, environmentBranch, releaseTypeExtractor, currentVersionFinder, new VersionIncrementor(logger), octokit, logger);
        logger.info('Establishing context');
        const buildContext = await contextEstablisher.establish(context);
        if (buildContext === undefined) {
            logger.debug('No establisher found for context');
            logger.debug(JSON.stringify(context, undefined, 2));
            outputDefault();
        } else {
            outputContext(buildContext);
        }

    } catch (error: any) {
        fail(error);
    }
}

function outputContext(context: BuildContext) {

    logger.info('Outputting: ');
    logger.info(`'should-publish': ${context.shouldPublish}`);
    logger.info(`'current-version': ${context.currentVersion}`);
    logger.info(`'new-version': ${context.newVersion}`);
    logger.info(`'release-type': ${context.releaseType}`);
    logger.info(`'pr-body': ${context.pullRequestBody}`);
    logger.info(`'pr-url': ${context.pullRequestUrl}`);

    setOutput('should-publish', context.shouldPublish);
    setOutput('current-version', context.currentVersion ?? '');
    setOutput('new-version', context.newVersion ?? '');
    setOutput('release-type', context.releaseType ?? '');
    setOutput('pr-body', context.pullRequestBody ?? '');
    setOutput('pr-url', context.pullRequestUrl ?? '');
}

function outputDefault() {
    outputContext({shouldPublish: false});
}

function fail(error: Error) {
    logger.error(error.message);
    setFailed(error.message);
}
