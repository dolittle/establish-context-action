// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as core from '@actions/core';
import * as github from '@actions/github';
import { Logger } from '@dolittle/github-actions.shared.logging';
import { CurrentVersionFinder } from './Version/CurrentVersionFinder';
import { ReleaseTypeExtractor } from './ReleaseType/ReleaseTypeExtractor';
import { Context } from '@actions/github/lib/context';
import { GitHub } from '@actions/github/lib/utils';
import { SemVerVersionSorter } from './Version/SemVerVersionSorter';
import { ContextEstablishers } from './ContextEstablishers';
import { CascadingContextEstablisher } from './CascadingBuildContextEstablisher';
import { MergedPullRequestContextEstablisher } from './MergedPullRequestContextEstablisher';
import { BuildContext } from './BuildContext';
import { ExtractPrereleaseBranchContext } from './ExtractPrereleaseBranchContext';

const inputs = {
    token: 'token',
    releaseBranches: 'releaseBranches'
};

const outputs = {
    shouldPublish: 'shouldPublish',
    currentVersion: 'currentVersion',
    releaseType: 'releaseType'
};

const logger = new Logger();

run();
export async function run() {
    try {
        const context = github.context;
        const contextString = JSON.stringify(context, undefined, 2);
        console.log(contextString);
        const token = core.getInput(inputs.token, { required: true });
        const releaseBranches = core.getInput(inputs.releaseBranches, { required: true }).split(',');
        logger.info(`Pushes to branches: [${releaseBranches.join(', ')}] can trigger a release`);
        const octokit = github.getOctokit(token);
        const releaseTypeExtractor = new ReleaseTypeExtractor(logger);
        const currentVersionFinder = new CurrentVersionFinder(
            new SemVerVersionSorter(logger),
            context,
            octokit,
            logger);
        const prereleaseBranchContextExtractor = new ExtractPrereleaseBranchContext(releaseBranches, logger);
        const contextEstablishers = new ContextEstablishers(
            new CascadingContextEstablisher(releaseBranches, prereleaseBranchContextExtractor, currentVersionFinder, logger),
            new MergedPullRequestContextEstablisher(releaseBranches, releaseTypeExtractor, prereleaseBranchContextExtractor, currentVersionFinder, octokit, logger)
        );
        logger.info('Establishing context');
        const buildContext = await contextEstablishers.establishFrom(context);
        if (buildContext === undefined) {
            logger.debug('No establisher found for context');
            outputDefault();
        }
        else outputContext(buildContext);

    } catch (error) {
        fail(error);
    }
}

function output(shouldPublish: boolean, currentVersion: string | undefined, releaseType: string | undefined) {
    logger.info('Outputting: ');
    logger.info(`'shouldPublish': ${shouldPublish}`);
    logger.info(`'currentVersion: ${currentVersion}`);
    logger.info(`'releaseType': ${releaseType}`);
    core.setOutput(outputs.shouldPublish, shouldPublish);
    core.setOutput(outputs.currentVersion, currentVersion);
    core.setOutput(outputs.releaseType, releaseType);
}
function outputContext(context: BuildContext) {
    output(context.shouldPublish, context.currentVersion, context.releaseType);
}

function outputDefault() {
    output(false, undefined, undefined);
}

function fail(error: Error) {
    logger.error(error.message);
    core.setFailed(error.message);
}
