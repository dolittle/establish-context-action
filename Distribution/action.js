"use strict";
// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const github_actions_shared_logging_1 = require("@dolittle/github-actions.shared.logging");
const CurrentVersionFinder_1 = require("./Version/CurrentVersionFinder");
const ReleaseTypeExtractor_1 = require("./ReleaseType/ReleaseTypeExtractor");
const SemVerVersionSorter_1 = require("./Version/SemVerVersionSorter");
const ContextEstablishers_1 = require("./ContextEstablishers");
const CascadingBuildContextEstablisher_1 = require("./CascadingBuildContextEstablisher");
const MergedPullRequestContextEstablisher_1 = require("./MergedPullRequestContextEstablisher");
const inputs = {
    token: 'token',
    mainBranch: 'mainBranch',
    prereleaseBranches: 'prereleaseBranches'
};
const outputs = {
    shouldPublish: 'shouldPublish',
    currentVersion: 'currentVersion',
    releaseType: 'releaseType'
};
const logger = new github_actions_shared_logging_1.Logger();
run();
function run() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const context = github.context;
            const token = core.getInput(inputs.token, { required: true });
            const mainBranch = core.getInput(inputs.mainBranch, { required: true });
            const releaseBranches = (_b = (_a = core.getInput(inputs.prereleaseBranches, { required: false })) === null || _a === void 0 ? void 0 : _a.split(',')) !== null && _b !== void 0 ? _b : [];
            logger.info(`Pushes to branches: [${releaseBranches.join(', ')}] can trigger a release`);
            const octokit = github.getOctokit(token);
            const releaseTypeExtractor = new ReleaseTypeExtractor_1.ReleaseTypeExtractor(logger);
            const currentVersionFinder = new CurrentVersionFinder_1.CurrentVersionFinder(new SemVerVersionSorter_1.SemVerVersionSorter(logger), context, octokit, logger);
            const contextEstablishers = new ContextEstablishers_1.ContextEstablishers(new CascadingBuildContextEstablisher_1.CascadingContextEstablisher(mainBranch, releaseBranches, currentVersionFinder, logger), new MergedPullRequestContextEstablisher_1.MergedPullRequestContextEstablisher(mainBranch, releaseBranches, releaseTypeExtractor, currentVersionFinder, octokit, logger));
            logger.info('Establishing context');
            const buildContext = yield contextEstablishers.establishFrom(context);
            if (buildContext === undefined) {
                logger.debug('No establisher found for context');
                outputDefault();
            }
            else
                outputContext(buildContext);
        }
        catch (error) {
            fail(error);
        }
    });
}
exports.run = run;
function output(shouldPublish, currentVersion, releaseType) {
    logger.info('Outputting: ');
    logger.info(`'shouldPublish': ${shouldPublish}`);
    logger.info(`'currentVersion: ${currentVersion}`);
    logger.info(`'releaseType': ${releaseType}`);
    core.setOutput(outputs.shouldPublish, shouldPublish);
    core.setOutput(outputs.currentVersion, currentVersion !== null && currentVersion !== void 0 ? currentVersion : '');
    core.setOutput(outputs.releaseType, releaseType !== null && releaseType !== void 0 ? releaseType : '');
}
function outputContext(context) {
    output(context.shouldPublish, context.currentVersion, context.releaseType);
}
function outputDefault() {
    output(false, '', '');
}
function fail(error) {
    logger.error(error.message);
    core.setFailed(error.message);
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,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TSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsYUFBYSxFQUFFLENBQUMsQ0FBQztJQUNqRCxNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFvQixjQUFjLEVBQUUsQ0FBQyxDQUFDO0lBQ2xELE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDN0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3JELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxjQUFjLGFBQWQsY0FBYyxjQUFkLGNBQWMsR0FBSSxFQUFFLENBQUMsQ0FBQztJQUM3RCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsV0FBVyxhQUFYLFdBQVcsY0FBWCxXQUFXLEdBQUksRUFBRSxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQUNELFNBQVMsYUFBYSxDQUFDLE9BQXFCO0lBQ3hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQy9FLENBQUM7QUFFRCxTQUFTLGFBQWE7SUFDbEIsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDMUIsQ0FBQztBQUVELFNBQVMsSUFBSSxDQUFDLEtBQVk7SUFDdEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDbEMsQ0FBQyIsImZpbGUiOiJhY3Rpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIERvbGl0dGxlLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLiBTZWUgTElDRU5TRSBmaWxlIGluIHRoZSBwcm9qZWN0IHJvb3QgZm9yIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbi5cblxuaW1wb3J0ICogYXMgY29yZSBmcm9tICdAYWN0aW9ucy9jb3JlJztcbmltcG9ydCAqIGFzIGdpdGh1YiBmcm9tICdAYWN0aW9ucy9naXRodWInO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnQGRvbGl0dGxlL2dpdGh1Yi1hY3Rpb25zLnNoYXJlZC5sb2dnaW5nJztcbmltcG9ydCB7IEN1cnJlbnRWZXJzaW9uRmluZGVyIH0gZnJvbSAnLi9WZXJzaW9uL0N1cnJlbnRWZXJzaW9uRmluZGVyJztcbmltcG9ydCB7IFJlbGVhc2VUeXBlRXh0cmFjdG9yIH0gZnJvbSAnLi9SZWxlYXNlVHlwZS9SZWxlYXNlVHlwZUV4dHJhY3Rvcic7XG5pbXBvcnQgeyBTZW1WZXJWZXJzaW9uU29ydGVyIH0gZnJvbSAnLi9WZXJzaW9uL1NlbVZlclZlcnNpb25Tb3J0ZXInO1xuaW1wb3J0IHsgQ29udGV4dEVzdGFibGlzaGVycyB9IGZyb20gJy4vQ29udGV4dEVzdGFibGlzaGVycyc7XG5pbXBvcnQgeyBDYXNjYWRpbmdDb250ZXh0RXN0YWJsaXNoZXIgfSBmcm9tICcuL0Nhc2NhZGluZ0J1aWxkQ29udGV4dEVzdGFibGlzaGVyJztcbmltcG9ydCB7IE1lcmdlZFB1bGxSZXF1ZXN0Q29udGV4dEVzdGFibGlzaGVyIH0gZnJvbSAnLi9NZXJnZWRQdWxsUmVxdWVzdENvbnRleHRFc3RhYmxpc2hlcic7XG5pbXBvcnQgeyBCdWlsZENvbnRleHQgfSBmcm9tICcuL0J1aWxkQ29udGV4dCc7XG5cbmNvbnN0IGlucHV0cyA9IHtcbiAgICB0b2tlbjogJ3Rva2VuJyxcbiAgICBtYWluQnJhbmNoOiAnbWFpbkJyYW5jaCcsXG4gICAgcHJlcmVsZWFzZUJyYW5jaGVzOiAncHJlcmVsZWFzZUJyYW5jaGVzJ1xufTtcblxuY29uc3Qgb3V0cHV0cyA9IHtcbiAgICBzaG91bGRQdWJsaXNoOiAnc2hvdWxkUHVibGlzaCcsXG4gICAgY3VycmVudFZlcnNpb246ICdjdXJyZW50VmVyc2lvbicsXG4gICAgcmVsZWFzZVR5cGU6ICdyZWxlYXNlVHlwZSdcbn07XG5cbmNvbnN0IGxvZ2dlciA9IG5ldyBMb2dnZXIoKTtcblxucnVuKCk7XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcnVuKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSBnaXRodWIuY29udGV4dDtcbiAgICAgICAgY29uc3QgdG9rZW4gPSBjb3JlLmdldElucHV0KGlucHV0cy50b2tlbiwgeyByZXF1aXJlZDogdHJ1ZSB9KTtcbiAgICAgICAgY29uc3QgbWFpbkJyYW5jaCA9IGNvcmUuZ2V0SW5wdXQoaW5wdXRzLm1haW5CcmFuY2gsIHsgcmVxdWlyZWQ6IHRydWUgfSk7XG4gICAgICAgIGNvbnN0IHJlbGVhc2VCcmFuY2hlcyA9IGNvcmUuZ2V0SW5wdXQoaW5wdXRzLnByZXJlbGVhc2VCcmFuY2hlcywgeyByZXF1aXJlZDogZmFsc2UgfSk/LnNwbGl0KCcsJykgPz8gW107XG4gICAgICAgIGxvZ2dlci5pbmZvKGBQdXNoZXMgdG8gYnJhbmNoZXM6IFske3JlbGVhc2VCcmFuY2hlcy5qb2luKCcsICcpfV0gY2FuIHRyaWdnZXIgYSByZWxlYXNlYCk7XG4gICAgICAgIGNvbnN0IG9jdG9raXQgPSBnaXRodWIuZ2V0T2N0b2tpdCh0b2tlbik7XG4gICAgICAgIGNvbnN0IHJlbGVhc2VUeXBlRXh0cmFjdG9yID0gbmV3IFJlbGVhc2VUeXBlRXh0cmFjdG9yKGxvZ2dlcik7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRWZXJzaW9uRmluZGVyID0gbmV3IEN1cnJlbnRWZXJzaW9uRmluZGVyKFxuICAgICAgICAgICAgbmV3IFNlbVZlclZlcnNpb25Tb3J0ZXIobG9nZ2VyKSxcbiAgICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAgICBvY3Rva2l0LFxuICAgICAgICAgICAgbG9nZ2VyKTtcbiAgICAgICAgY29uc3QgY29udGV4dEVzdGFibGlzaGVycyA9IG5ldyBDb250ZXh0RXN0YWJsaXNoZXJzKFxuICAgICAgICAgICAgbmV3IENhc2NhZGluZ0NvbnRleHRFc3RhYmxpc2hlcihtYWluQnJhbmNoLCByZWxlYXNlQnJhbmNoZXMsIGN1cnJlbnRWZXJzaW9uRmluZGVyLCBsb2dnZXIpLFxuICAgICAgICAgICAgbmV3IE1lcmdlZFB1bGxSZXF1ZXN0Q29udGV4dEVzdGFibGlzaGVyKG1haW5CcmFuY2gsIHJlbGVhc2VCcmFuY2hlcywgcmVsZWFzZVR5cGVFeHRyYWN0b3IsIGN1cnJlbnRWZXJzaW9uRmluZGVyLCBvY3Rva2l0LCBsb2dnZXIpXG4gICAgICAgICk7XG4gICAgICAgIGxvZ2dlci5pbmZvKCdFc3RhYmxpc2hpbmcgY29udGV4dCcpO1xuICAgICAgICBjb25zdCBidWlsZENvbnRleHQgPSBhd2FpdCBjb250ZXh0RXN0YWJsaXNoZXJzLmVzdGFibGlzaEZyb20oY29udGV4dCk7XG4gICAgICAgIGlmIChidWlsZENvbnRleHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdObyBlc3RhYmxpc2hlciBmb3VuZCBmb3IgY29udGV4dCcpO1xuICAgICAgICAgICAgb3V0cHV0RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Ugb3V0cHV0Q29udGV4dChidWlsZENvbnRleHQpO1xuXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZmFpbChlcnJvcik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBvdXRwdXQoc2hvdWxkUHVibGlzaDogYm9vbGVhbiwgY3VycmVudFZlcnNpb246IHN0cmluZyB8wqB1bmRlZmluZWQsIHJlbGVhc2VUeXBlOiBzdHJpbmcgfCB1bmRlZmluZWQpIHtcbiAgICBsb2dnZXIuaW5mbygnT3V0cHV0dGluZzogJyk7XG4gICAgbG9nZ2VyLmluZm8oYCdzaG91bGRQdWJsaXNoJzogJHtzaG91bGRQdWJsaXNofWApO1xuICAgIGxvZ2dlci5pbmZvKGAnY3VycmVudFZlcnNpb246ICR7Y3VycmVudFZlcnNpb259YCk7XG4gICAgbG9nZ2VyLmluZm8oYCdyZWxlYXNlVHlwZSc6ICR7cmVsZWFzZVR5cGV9YCk7XG4gICAgY29yZS5zZXRPdXRwdXQob3V0cHV0cy5zaG91bGRQdWJsaXNoLCBzaG91bGRQdWJsaXNoKTtcbiAgICBjb3JlLnNldE91dHB1dChvdXRwdXRzLmN1cnJlbnRWZXJzaW9uLCBjdXJyZW50VmVyc2lvbiA/PyAnJyk7XG4gICAgY29yZS5zZXRPdXRwdXQob3V0cHV0cy5yZWxlYXNlVHlwZSwgcmVsZWFzZVR5cGUgPz8gJycpO1xufVxuZnVuY3Rpb24gb3V0cHV0Q29udGV4dChjb250ZXh0OiBCdWlsZENvbnRleHQpIHtcbiAgICBvdXRwdXQoY29udGV4dC5zaG91bGRQdWJsaXNoLCBjb250ZXh0LmN1cnJlbnRWZXJzaW9uLCBjb250ZXh0LnJlbGVhc2VUeXBlKTtcbn1cblxuZnVuY3Rpb24gb3V0cHV0RGVmYXVsdCgpIHtcbiAgICBvdXRwdXQoZmFsc2UsICcnLCAnJyk7XG59XG5cbmZ1bmN0aW9uIGZhaWwoZXJyb3I6IEVycm9yKSB7XG4gICAgbG9nZ2VyLmVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICAgIGNvcmUuc2V0RmFpbGVkKGVycm9yLm1lc3NhZ2UpO1xufVxuIl19
