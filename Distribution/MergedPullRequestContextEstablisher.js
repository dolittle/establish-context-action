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
exports.MergedPullRequestContextEstablisher = void 0;
const path_1 = __importDefault(require("path"));
/**
 * Represents an implementation of {ICanEstablishContext}.
 *
 * @export
 * @class MergedPullRequestContextEstablisher
 * @implements {ICanEstablishContext}
 */
class MergedPullRequestContextEstablisher {
    /**
     * Creates an instance of MergedPullRequestContextEstablisher.
     * @param {InstanceType<typeof GitHub>} _github The github REST api.
     */
    constructor(_mainBranch, _prereleaseBranches, _releaseTypeExtractor, _currentVersionFinder, _github, _logger) {
        this._mainBranch = _mainBranch;
        this._prereleaseBranches = _prereleaseBranches;
        this._releaseTypeExtractor = _releaseTypeExtractor;
        this._currentVersionFinder = _currentVersionFinder;
        this._github = _github;
        this._logger = _logger;
    }
    /**
     * @inheritdoc
     */
    canEstablishFrom(context) {
        var _a;
        const branchName = path_1.default.basename(context.ref);
        return context.payload.pull_request !== undefined
            && context.payload.action === 'closed'
            && ((_a = context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.merged)
            && (branchName === this._mainBranch || this._prereleaseBranches.includes(branchName));
    }
    /**
     * @inheritdoc
     */
    establish(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.canEstablishFrom(context))
                throw new Error('Cannot establish merged pull request context');
            this._logger.debug('Establishing context for merged pull build');
            const { owner, repo } = context.repo;
            const mergedPr = yield this._getMergedPr(owner, repo, context.sha);
            if (!mergedPr) {
                const message = `Could not find a merged pull request with the merge_commit_sha ${context.sha}`;
                this._logger.error(message);
                throw new Error(message);
            }
            const releaseType = this._releaseTypeExtractor.extract(mergedPr === null || mergedPr === void 0 ? void 0 : mergedPr.labels.map(_ => _.name));
            if (!releaseType)
                return { shouldPublish: false };
            const branchName = path_1.default.basename(context.ref);
            const prereleaseIdentifier = branchName === this._mainBranch ? undefined : branchName;
            const currentVersion = yield this._currentVersionFinder.find(prereleaseIdentifier);
            return { shouldPublish: true, releaseType, currentVersion: currentVersion.version };
        });
    }
    _getMergedPr(owner, repo, sha) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.debug(`Trying to get merged PR with merge_commit_sha: ${sha}`);
            const mergedPr = yield this._github.paginate(this._github.pulls.list, { owner, repo, state: 'closed', sort: 'updated', direction: 'desc' }).then(data => data.find(pr => pr.merge_commit_sha === sha));
            return mergedPr;
        });
    }
}
exports.MergedPullRequestContextEstablisher = MergedPullRequestContextEstablisher;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNvdXJjZS9NZXJnZWRQdWxsUmVxdWVzdENvbnRleHRFc3RhYmxpc2hlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0NBQStDO0FBQy9DLHFHQUFxRzs7Ozs7Ozs7Ozs7Ozs7O0FBRXJHLGdEQUF3QjtBQVN4Qjs7Ozs7O0dBTUc7QUFDSCxNQUFhLG1DQUFtQztJQUU1Qzs7O09BR0c7SUFDSCxZQUNxQixXQUFtQixFQUNuQixtQkFBNkIsRUFDN0IscUJBQTRDLEVBQzVDLHFCQUEwQyxFQUMxQyxPQUFvQyxFQUNwQyxPQUFnQjtRQUxoQixnQkFBVyxHQUFYLFdBQVcsQ0FBUTtRQUNuQix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQVU7UUFDN0IsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQUM1QywwQkFBcUIsR0FBckIscUJBQXFCLENBQXFCO1FBQzFDLFlBQU8sR0FBUCxPQUFPLENBQTZCO1FBQ3BDLFlBQU8sR0FBUCxPQUFPLENBQVM7SUFDakMsQ0FBQztJQUNMOztPQUVHO0lBQ0gsZ0JBQWdCLENBQUMsT0FBZ0I7O1FBQzdCLE1BQU0sVUFBVSxHQUFHLGNBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlDLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEtBQUssU0FBUztlQUMxQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxRQUFRO3NCQUNuQyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksMENBQUUsTUFBTSxDQUFBO2VBQ3BDLENBQUMsVUFBVSxLQUFLLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQzlGLENBQUM7SUFFRDs7T0FFRztJQUNHLFNBQVMsQ0FBQyxPQUFnQjs7WUFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7Z0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1lBQ3JHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7WUFDakUsTUFBTSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQ25DLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuRSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNYLE1BQU0sT0FBTyxHQUFHLGtFQUFrRSxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ2hHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzVCO1lBQ0QsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUMxRixJQUFJLENBQUMsV0FBVztnQkFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxDQUFDO1lBQ2xELE1BQU0sVUFBVSxHQUFHLGNBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlDLE1BQU0sb0JBQW9CLEdBQUcsVUFBVSxLQUFLLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1lBQ3RGLE1BQU0sY0FBYyxHQUFHLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQ25GLE9BQU8sRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUUsY0FBYyxDQUFDLE9BQU8sRUFBQyxDQUFDO1FBQ3ZGLENBQUM7S0FBQTtJQUVhLFlBQVksQ0FBQyxLQUFhLEVBQUUsSUFBWSxFQUFFLEdBQVc7O1lBQy9ELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGtEQUFrRCxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQzVFLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFDdkIsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLENBQ3ZFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzdELE9BQU8sUUFBUSxDQUFDO1FBQ3BCLENBQUM7S0FBQTtDQUNKO0FBdERELGtGQXNEQyIsImZpbGUiOiJNZXJnZWRQdWxsUmVxdWVzdENvbnRleHRFc3RhYmxpc2hlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgRG9saXR0bGUuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIGZpbGUgaW4gdGhlIHByb2plY3Qgcm9vdCBmb3IgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uLlxuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tICdAYWN0aW9ucy9naXRodWIvbGliL2NvbnRleHQnO1xuaW1wb3J0IHsgR2l0SHViIH0gZnJvbSAnQGFjdGlvbnMvZ2l0aHViL2xpYi91dGlscyc7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSAnQGRvbGl0dGxlL2dpdGh1Yi1hY3Rpb25zLnNoYXJlZC5sb2dnaW5nJztcbmltcG9ydCB7IEJ1aWxkQ29udGV4dCB9IGZyb20gJy4vQnVpbGRDb250ZXh0JztcbmltcG9ydCB7IElDYW5Fc3RhYmxpc2hDb250ZXh0IH0gZnJvbSAnLi9JQ2FuRXN0YWJsaXNoQ29udGV4dCc7XG5pbXBvcnQgeyBJUmVsZWFzZVR5cGVFeHRyYWN0b3IgfSBmcm9tICcuL1JlbGVhc2VUeXBlL0lSZWxlYXNlVHlwZUV4dHJhY3Rvcic7XG5pbXBvcnQgeyBJRmluZEN1cnJlbnRWZXJzaW9uIH0gZnJvbSAnLi9WZXJzaW9uL0lGaW5kQ3VycmVudFZlcnNpb24nO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gaW1wbGVtZW50YXRpb24gb2Yge0lDYW5Fc3RhYmxpc2hDb250ZXh0fS5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgTWVyZ2VkUHVsbFJlcXVlc3RDb250ZXh0RXN0YWJsaXNoZXJcbiAqIEBpbXBsZW1lbnRzIHtJQ2FuRXN0YWJsaXNoQ29udGV4dH1cbiAqL1xuZXhwb3J0IGNsYXNzIE1lcmdlZFB1bGxSZXF1ZXN0Q29udGV4dEVzdGFibGlzaGVyIGltcGxlbWVudHMgSUNhbkVzdGFibGlzaENvbnRleHQge1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBNZXJnZWRQdWxsUmVxdWVzdENvbnRleHRFc3RhYmxpc2hlci5cbiAgICAgKiBAcGFyYW0ge0luc3RhbmNlVHlwZTx0eXBlb2YgR2l0SHViPn0gX2dpdGh1YiBUaGUgZ2l0aHViIFJFU1QgYXBpLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IF9tYWluQnJhbmNoOiBzdHJpbmcsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgX3ByZXJlbGVhc2VCcmFuY2hlczogc3RyaW5nW10sXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgX3JlbGVhc2VUeXBlRXh0cmFjdG9yOiBJUmVsZWFzZVR5cGVFeHRyYWN0b3IsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgX2N1cnJlbnRWZXJzaW9uRmluZGVyOiBJRmluZEN1cnJlbnRWZXJzaW9uLFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IF9naXRodWI6IEluc3RhbmNlVHlwZTx0eXBlb2YgR2l0SHViPixcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBfbG9nZ2VyOiBJTG9nZ2VyKSB7XG4gICAgICAgIH1cbiAgICAvKipcbiAgICAgKiBAaW5oZXJpdGRvY1xuICAgICAqL1xuICAgIGNhbkVzdGFibGlzaEZyb20oY29udGV4dDogQ29udGV4dCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBicmFuY2hOYW1lID0gcGF0aC5iYXNlbmFtZShjb250ZXh0LnJlZik7XG4gICAgICAgIHJldHVybiBjb250ZXh0LnBheWxvYWQucHVsbF9yZXF1ZXN0ICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICYmIGNvbnRleHQucGF5bG9hZC5hY3Rpb24gPT09ICdjbG9zZWQnXG4gICAgICAgICAgICAmJiBjb250ZXh0LnBheWxvYWQucHVsbF9yZXF1ZXN0Py5tZXJnZWRcbiAgICAgICAgICAgICYmIChicmFuY2hOYW1lID09PSB0aGlzLl9tYWluQnJhbmNoIHx8wqB0aGlzLl9wcmVyZWxlYXNlQnJhbmNoZXMuaW5jbHVkZXMoYnJhbmNoTmFtZSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBpbmhlcml0ZG9jXG4gICAgICovXG4gICAgYXN5bmMgZXN0YWJsaXNoKGNvbnRleHQ6IENvbnRleHQpOiBQcm9taXNlPEJ1aWxkQ29udGV4dD4ge1xuICAgICAgICBpZiAoIXRoaXMuY2FuRXN0YWJsaXNoRnJvbShjb250ZXh0KSkgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZXN0YWJsaXNoIG1lcmdlZCBwdWxsIHJlcXVlc3QgY29udGV4dCcpO1xuICAgICAgICB0aGlzLl9sb2dnZXIuZGVidWcoJ0VzdGFibGlzaGluZyBjb250ZXh0IGZvciBtZXJnZWQgcHVsbCBidWlsZCcpO1xuICAgICAgICBjb25zdCB7b3duZXIsIHJlcG99ID0gY29udGV4dC5yZXBvO1xuICAgICAgICBjb25zdCBtZXJnZWRQciA9IGF3YWl0IHRoaXMuX2dldE1lcmdlZFByKG93bmVyLCByZXBvLCBjb250ZXh0LnNoYSk7XG4gICAgICAgIGlmICghbWVyZ2VkUHIpIHtcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBgQ291bGQgbm90IGZpbmQgYSBtZXJnZWQgcHVsbCByZXF1ZXN0IHdpdGggdGhlIG1lcmdlX2NvbW1pdF9zaGEgJHtjb250ZXh0LnNoYX1gO1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKG1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlbGVhc2VUeXBlID0gdGhpcy5fcmVsZWFzZVR5cGVFeHRyYWN0b3IuZXh0cmFjdChtZXJnZWRQcj8ubGFiZWxzLm1hcChfID0+IF8ubmFtZSkpO1xuICAgICAgICBpZiAoIXJlbGVhc2VUeXBlKSByZXR1cm4geyBzaG91bGRQdWJsaXNoOiBmYWxzZSB9O1xuICAgICAgICBjb25zdCBicmFuY2hOYW1lID0gcGF0aC5iYXNlbmFtZShjb250ZXh0LnJlZik7XG4gICAgICAgIGNvbnN0IHByZXJlbGVhc2VJZGVudGlmaWVyID0gYnJhbmNoTmFtZSA9PT0gdGhpcy5fbWFpbkJyYW5jaCA/IHVuZGVmaW5lZCA6IGJyYW5jaE5hbWU7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRWZXJzaW9uID0gYXdhaXQgdGhpcy5fY3VycmVudFZlcnNpb25GaW5kZXIuZmluZChwcmVyZWxlYXNlSWRlbnRpZmllcik7XG4gICAgICAgIHJldHVybiB7IHNob3VsZFB1Ymxpc2g6IHRydWUsIHJlbGVhc2VUeXBlLCBjdXJyZW50VmVyc2lvbjogY3VycmVudFZlcnNpb24udmVyc2lvbn07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBfZ2V0TWVyZ2VkUHIob3duZXI6IHN0cmluZywgcmVwbzogc3RyaW5nLCBzaGE6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9sb2dnZXIuZGVidWcoYFRyeWluZyB0byBnZXQgbWVyZ2VkIFBSIHdpdGggbWVyZ2VfY29tbWl0X3NoYTogJHtzaGF9YCk7XG4gICAgICAgIGNvbnN0IG1lcmdlZFByID0gYXdhaXQgdGhpcy5fZ2l0aHViLnBhZ2luYXRlKFxuICAgICAgICAgICAgdGhpcy5fZ2l0aHViLnB1bGxzLmxpc3QsXG4gICAgICAgICAgICB7IG93bmVyLCByZXBvLCBzdGF0ZTogJ2Nsb3NlZCcsIHNvcnQ6ICd1cGRhdGVkJywgZGlyZWN0aW9uOiAnZGVzYycgfVxuICAgICAgICApLnRoZW4oZGF0YSA9PiBkYXRhLmZpbmQocHIgPT4gcHIubWVyZ2VfY29tbWl0X3NoYSA9PT0gc2hhKSk7XG4gICAgICAgIHJldHVybiBtZXJnZWRQcjtcbiAgICB9XG59XG4iXX0=
