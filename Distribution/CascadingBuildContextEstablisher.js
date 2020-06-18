"use strict";
// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CascadingContextEstablisher = void 0;
const path_1 = __importDefault(require("path"));
const github_actions_shared_rudiments_1 = require("@dolittle/github-actions.shared.rudiments");
/**
 * Represents an implementation of {ICanEstablishContext}.
 *
 * @export
 * @class CascadingContextEstablisher
 * @implements {ICanEstablishContext}
 */
class CascadingContextEstablisher {
    /**
     * Creates an instance of CascadingContextEstablisher.
     * @param {InstanceType<typeof GitHub>} _github The github REST api.
     */
    constructor(_mainBranch, _prereleaseBranches, _currentVersionFinder, _logger) {
        this._mainBranch = _mainBranch;
        this._prereleaseBranches = _prereleaseBranches;
        this._currentVersionFinder = _currentVersionFinder;
        this._logger = _logger;
    }
    /**
     * @inheritdoc
     */
    canEstablishFrom(context) {
        const branchName = path_1.default.basename(context.ref);
        return context.eventName === 'push'
            && context.payload.head_commit.message.startsWith(github_actions_shared_rudiments_1.CascadingBuild.message)
            && context.payload.pusher.name === github_actions_shared_rudiments_1.CascadingBuild.pusher
            && (branchName === this._mainBranch || this._prereleaseBranches.includes(branchName));
    }
    /**
     * @inheritdoc
     */
    establish(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.canEstablishFrom(context))
                throw new Error('Cannot establish cascading build context');
            this._logger.debug('Establishing context for cascading build');
            const branchName = path_1.default.basename(context.ref);
            const prereleaseIdentifier = branchName === this._mainBranch ? undefined : branchName;
            const currentVersion = yield this._currentVersionFinder.find(prereleaseIdentifier);
            const currentVersionPrereleaseComponents = currentVersion.prerelease;
            const releaseType = currentVersionPrereleaseComponents.length > 0 ? 'prerelease' : 'patch';
            return { shouldPublish: true, releaseType, currentVersion: currentVersion.version };
        });
    }
}
exports.CascadingContextEstablisher = CascadingContextEstablisher;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNvdXJjZS9DYXNjYWRpbmdCdWlsZENvbnRleHRFc3RhYmxpc2hlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0NBQStDO0FBQy9DLHFHQUFxRzs7Ozs7Ozs7Ozs7Ozs7O0FBRXJHLGdEQUF3QjtBQUd4QiwrRkFBMkU7QUFNM0U7Ozs7OztHQU1HO0FBQ0gsTUFBYSwyQkFBMkI7SUFFcEM7OztPQUdHO0lBQ0gsWUFDcUIsV0FBbUIsRUFDbkIsbUJBQTZCLEVBQzdCLHFCQUEwQyxFQUMxQyxPQUFnQjtRQUhoQixnQkFBVyxHQUFYLFdBQVcsQ0FBUTtRQUNuQix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQVU7UUFDN0IsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUFxQjtRQUMxQyxZQUFPLEdBQVAsT0FBTyxDQUFTO0lBQ2pDLENBQUM7SUFDTDs7T0FFRztJQUNILGdCQUFnQixDQUFDLE9BQWdCO1FBQzdCLE1BQU0sVUFBVSxHQUFHLGNBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlDLE9BQU8sT0FBTyxDQUFDLFNBQVMsS0FBSyxNQUFNO2VBQzVCLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsZ0RBQWMsQ0FBQyxPQUFPLENBQUM7ZUFDdEUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLGdEQUFjLENBQUMsTUFBTTtlQUNyRCxDQUFDLFVBQVUsS0FBSyxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBRUQ7O09BRUc7SUFDRyxTQUFTLENBQUMsT0FBZ0I7O1lBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDO2dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQztZQUNqRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO1lBQy9ELE1BQU0sVUFBVSxHQUFHLGNBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlDLE1BQU0sb0JBQW9CLEdBQUcsVUFBVSxLQUFLLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1lBQ3RGLE1BQU0sY0FBYyxHQUFHLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQ25GLE1BQU0sa0NBQWtDLEdBQUcsY0FBYyxDQUFDLFVBQVUsQ0FBQztZQUNyRSxNQUFNLFdBQVcsR0FBZ0Isa0NBQWtDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFFeEcsT0FBTyxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRSxjQUFjLENBQUMsT0FBTyxFQUFDLENBQUM7UUFDdkYsQ0FBQztLQUFBO0NBQ0o7QUFyQ0Qsa0VBcUNDIiwiZmlsZSI6IkNhc2NhZGluZ0J1aWxkQ29udGV4dEVzdGFibGlzaGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSBEb2xpdHRsZS4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS4gU2VlIExJQ0VOU0UgZmlsZSBpbiB0aGUgcHJvamVjdCByb290IGZvciBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24uXG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gJ0BhY3Rpb25zL2dpdGh1Yi9saWIvY29udGV4dCc7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSAnQGRvbGl0dGxlL2dpdGh1Yi1hY3Rpb25zLnNoYXJlZC5sb2dnaW5nJztcbmltcG9ydCB7IENhc2NhZGluZ0J1aWxkIH0gZnJvbSAnQGRvbGl0dGxlL2dpdGh1Yi1hY3Rpb25zLnNoYXJlZC5ydWRpbWVudHMnO1xuaW1wb3J0IHNlbXZlciwgeyBSZWxlYXNlVHlwZSB9IGZyb20gJ3NlbXZlcic7XG5pbXBvcnQgeyBCdWlsZENvbnRleHQgfSBmcm9tICcuL0J1aWxkQ29udGV4dCc7XG5pbXBvcnQgeyBJQ2FuRXN0YWJsaXNoQ29udGV4dCB9IGZyb20gJy4vSUNhbkVzdGFibGlzaENvbnRleHQnO1xuaW1wb3J0IHsgSUZpbmRDdXJyZW50VmVyc2lvbiB9IGZyb20gJy4vVmVyc2lvbi9JRmluZEN1cnJlbnRWZXJzaW9uJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGFuIGltcGxlbWVudGF0aW9uIG9mIHtJQ2FuRXN0YWJsaXNoQ29udGV4dH0uXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIENhc2NhZGluZ0NvbnRleHRFc3RhYmxpc2hlclxuICogQGltcGxlbWVudHMge0lDYW5Fc3RhYmxpc2hDb250ZXh0fVxuICovXG5leHBvcnQgY2xhc3MgQ2FzY2FkaW5nQ29udGV4dEVzdGFibGlzaGVyIGltcGxlbWVudHMgSUNhbkVzdGFibGlzaENvbnRleHQge1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBDYXNjYWRpbmdDb250ZXh0RXN0YWJsaXNoZXIuXG4gICAgICogQHBhcmFtIHtJbnN0YW5jZVR5cGU8dHlwZW9mIEdpdEh1Yj59IF9naXRodWIgVGhlIGdpdGh1YiBSRVNUIGFwaS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBfbWFpbkJyYW5jaDogc3RyaW5nLFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IF9wcmVyZWxlYXNlQnJhbmNoZXM6IHN0cmluZ1tdLFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IF9jdXJyZW50VmVyc2lvbkZpbmRlcjogSUZpbmRDdXJyZW50VmVyc2lvbixcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBfbG9nZ2VyOiBJTG9nZ2VyKSB7XG4gICAgICAgIH1cbiAgICAvKipcbiAgICAgKiBAaW5oZXJpdGRvY1xuICAgICAqL1xuICAgIGNhbkVzdGFibGlzaEZyb20oY29udGV4dDogQ29udGV4dCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBicmFuY2hOYW1lID0gcGF0aC5iYXNlbmFtZShjb250ZXh0LnJlZik7XG4gICAgICAgIHJldHVybiBjb250ZXh0LmV2ZW50TmFtZSA9PT0gJ3B1c2gnXG4gICAgICAgICAgICAmJiBjb250ZXh0LnBheWxvYWQuaGVhZF9jb21taXQubWVzc2FnZS5zdGFydHNXaXRoKENhc2NhZGluZ0J1aWxkLm1lc3NhZ2UpXG4gICAgICAgICAgICAmJiBjb250ZXh0LnBheWxvYWQucHVzaGVyLm5hbWUgPT09IENhc2NhZGluZ0J1aWxkLnB1c2hlclxuICAgICAgICAgICAgJiYgKGJyYW5jaE5hbWUgPT09IHRoaXMuX21haW5CcmFuY2ggfHzCoHRoaXMuX3ByZXJlbGVhc2VCcmFuY2hlcy5pbmNsdWRlcyhicmFuY2hOYW1lKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGluaGVyaXRkb2NcbiAgICAgKi9cbiAgICBhc3luYyBlc3RhYmxpc2goY29udGV4dDogQ29udGV4dCk6IFByb21pc2U8QnVpbGRDb250ZXh0PiB7XG4gICAgICAgIGlmICghdGhpcy5jYW5Fc3RhYmxpc2hGcm9tKGNvbnRleHQpKSB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBlc3RhYmxpc2ggY2FzY2FkaW5nIGJ1aWxkIGNvbnRleHQnKTtcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmRlYnVnKCdFc3RhYmxpc2hpbmcgY29udGV4dCBmb3IgY2FzY2FkaW5nIGJ1aWxkJyk7XG4gICAgICAgIGNvbnN0IGJyYW5jaE5hbWUgPSBwYXRoLmJhc2VuYW1lKGNvbnRleHQucmVmKTtcbiAgICAgICAgY29uc3QgcHJlcmVsZWFzZUlkZW50aWZpZXIgPSBicmFuY2hOYW1lID09PSB0aGlzLl9tYWluQnJhbmNoID8gdW5kZWZpbmVkIDogYnJhbmNoTmFtZTtcbiAgICAgICAgY29uc3QgY3VycmVudFZlcnNpb24gPSBhd2FpdCB0aGlzLl9jdXJyZW50VmVyc2lvbkZpbmRlci5maW5kKHByZXJlbGVhc2VJZGVudGlmaWVyKTtcbiAgICAgICAgY29uc3QgY3VycmVudFZlcnNpb25QcmVyZWxlYXNlQ29tcG9uZW50cyA9IGN1cnJlbnRWZXJzaW9uLnByZXJlbGVhc2U7XG4gICAgICAgIGNvbnN0IHJlbGVhc2VUeXBlOiBSZWxlYXNlVHlwZSA9IGN1cnJlbnRWZXJzaW9uUHJlcmVsZWFzZUNvbXBvbmVudHMubGVuZ3RoID4gMCA/ICdwcmVyZWxlYXNlJyA6ICdwYXRjaCc7XG5cbiAgICAgICAgcmV0dXJuIHsgc2hvdWxkUHVibGlzaDogdHJ1ZSwgcmVsZWFzZVR5cGUsIGN1cnJlbnRWZXJzaW9uOiBjdXJyZW50VmVyc2lvbi52ZXJzaW9ufTtcbiAgICB9XG59XG4iXX0=
