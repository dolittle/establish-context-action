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
exports.CurrentVersionFinder = void 0;
const semver_1 = __importStar(require("semver"));
/**
 * Represents an implementation of {ICanGetLatestVersion} that can get the latest version from Github
 *
 * @export
 * @class GithubLatestVersionFinder
 * @implements {ICanGetLatestVersion}
 */
class CurrentVersionFinder {
    /**
     * Instantiates an instance of {GithubVersionTags}.
     */
    constructor(_versionSorter, _context, _github, _logger) {
        this._versionSorter = _versionSorter;
        this._context = _context;
        this._github = _github;
        this._logger = _logger;
    }
    /**
     * @inheritdoc
     */
    find(prereleaseIdentifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const { owner, repo } = this._context.repo;
            this._logger.debug(`Getting version tags from github.com/${owner}/${repo}${prereleaseIdentifier !== undefined ? ` with prerelease identifier '${prereleaseIdentifier}'` : ''}`);
            let versions = yield this._getVersionsFromRepoTags(owner, repo);
            if (!versions || versions.length === 0) {
                const defaultVersion = this._getDefaultVersion(prereleaseIdentifier);
                this._logger.info(`No version tags. Defaulting to version ${defaultVersion}`);
                return defaultVersion;
            }
            if (prereleaseIdentifier !== undefined) {
                versions = versions.filter(_ => _.prerelease.length > 0 && _.prerelease[0] === prereleaseIdentifier);
                if (versions.length === 0) {
                    const defaultVersion = this._getDefaultVersion(prereleaseIdentifier);
                    this._logger.info(`No version tag with prerelease identifier '${prereleaseIdentifier}' was found. Defaulting to version ${defaultVersion}`);
                    return defaultVersion;
                }
            }
            this._logger.debug(`Version tags: [
${versions.join(',\n')}
]`);
            const currentVersion = this._versionSorter.sort(versions, true)[0];
            if (!semver_1.default.valid(currentVersion))
                throw new Error(`${currentVersion} is not a valid SemVer version`);
            this._logger.info(`Current version '${currentVersion}'`);
            return currentVersion;
        });
    }
    _getVersionsFromRepoTags(owner, repo) {
        return __awaiter(this, void 0, void 0, function* () {
            const versions = yield this._github.paginate(this._github.repos.listTags, { owner, repo }, response => response.data
                .filter(tag => semver_1.default.valid(tag.name))
                .map(_ => _.name));
            return versions.map(_ => semver_1.default.parse(_));
        });
    }
    _getDefaultVersion(prereleaseIdentifier) {
        if (prereleaseIdentifier === undefined)
            return new semver_1.SemVer('1.0.0');
        return new semver_1.SemVer(`1.0.0-${prereleaseIdentifier}.0`);
    }
}
exports.CurrentVersionFinder = CurrentVersionFinder;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNvdXJjZS9WZXJzaW9uL0N1cnJlbnRWZXJzaW9uRmluZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwrQ0FBK0M7QUFDL0MscUdBQXFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRXJHLGlEQUF3QztBQU94Qzs7Ozs7O0dBTUc7QUFDSCxNQUFhLG9CQUFvQjtJQUU3Qjs7T0FFRztJQUNILFlBQTZCLGNBQThCLEVBQW1CLFFBQWlCLEVBQW1CLE9BQW9DLEVBQW9CLE9BQWdCO1FBQTdKLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUFtQixhQUFRLEdBQVIsUUFBUSxDQUFTO1FBQW1CLFlBQU8sR0FBUCxPQUFPLENBQTZCO1FBQW9CLFlBQU8sR0FBUCxPQUFPLENBQVM7SUFBRyxDQUFDO0lBRTlMOztPQUVHO0lBQ0csSUFBSSxDQUFDLG9CQUE2Qjs7WUFDcEMsTUFBTSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUN6QyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyx3Q0FBd0MsS0FBSyxJQUFJLElBQUksR0FBRyxvQkFBb0IsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLGdDQUFnQyxvQkFBb0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2hMLElBQUksUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLHdCQUF3QixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNoRSxJQUFJLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNwQyxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLENBQUMsQ0FBQztnQkFDckUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsMENBQTBDLGNBQWMsRUFBRSxDQUFDLENBQUM7Z0JBQzlFLE9BQU8sY0FBYyxDQUFDO2FBQ3pCO1lBRUQsSUFBSSxvQkFBb0IsS0FBSyxTQUFTLEVBQUU7Z0JBQ3BDLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssb0JBQW9CLENBQUMsQ0FBQztnQkFDckcsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtvQkFDdkIsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQixDQUFDLENBQUM7b0JBQ3JFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLDhDQUE4QyxvQkFBb0Isc0NBQXNDLGNBQWMsRUFBRSxDQUFDLENBQUM7b0JBQzVJLE9BQU8sY0FBYyxDQUFDO2lCQUN6QjthQUNKO1lBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7RUFDekIsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7RUFDcEIsQ0FBQyxDQUFDO1lBRUksTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25FLElBQUksQ0FBQyxnQkFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUM7Z0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLGNBQWMsZ0NBQWdDLENBQUMsQ0FBQztZQUN0RyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsY0FBYyxHQUFHLENBQUMsQ0FBQztZQUN6RCxPQUFPLGNBQWMsQ0FBQztRQUMxQixDQUFDO0tBQUE7SUFFYSx3QkFBd0IsQ0FBQyxLQUFhLEVBQUUsSUFBWTs7WUFDOUQsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FDeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUMzQixFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsRUFDYixRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJO2lCQUNBLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLGdCQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDckMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUssQ0FBQyxDQUFDLENBQUM7WUFFaEQsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQztRQUMvQyxDQUFDO0tBQUE7SUFFTyxrQkFBa0IsQ0FBQyxvQkFBNkI7UUFDcEQsSUFBSSxvQkFBb0IsS0FBSyxTQUFTO1lBQUUsT0FBTyxJQUFJLGVBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuRSxPQUFPLElBQUksZUFBTSxDQUFDLFNBQVMsb0JBQW9CLElBQUksQ0FBQyxDQUFDO0lBQ3pELENBQUM7Q0FDSjtBQXRERCxvREFzREMiLCJmaWxlIjoiVmVyc2lvbi9DdXJyZW50VmVyc2lvbkZpbmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgRG9saXR0bGUuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIGZpbGUgaW4gdGhlIHByb2plY3Qgcm9vdCBmb3IgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uLlxuXG5pbXBvcnQgc2VtdmVyLCB7IFNlbVZlciB9IGZyb20gJ3NlbXZlcic7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSAnQGRvbGl0dGxlL2dpdGh1Yi1hY3Rpb25zLnNoYXJlZC5sb2dnaW5nJztcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tICdAYWN0aW9ucy9naXRodWIvbGliL2NvbnRleHQnO1xuaW1wb3J0IHsgR2l0SHViIH0gZnJvbSAnQGFjdGlvbnMvZ2l0aHViL2xpYi91dGlscyc7XG5pbXBvcnQgeyBJRmluZEN1cnJlbnRWZXJzaW9uIH0gZnJvbSAnLi9JRmluZEN1cnJlbnRWZXJzaW9uJztcbmltcG9ydCB7IElWZXJzaW9uU29ydGVyIH0gZnJvbSAnLi9JVmVyc2lvblNvcnRlcic7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhbiBpbXBsZW1lbnRhdGlvbiBvZiB7SUNhbkdldExhdGVzdFZlcnNpb259IHRoYXQgY2FuIGdldCB0aGUgbGF0ZXN0IHZlcnNpb24gZnJvbSBHaXRodWJcbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgR2l0aHViTGF0ZXN0VmVyc2lvbkZpbmRlclxuICogQGltcGxlbWVudHMge0lDYW5HZXRMYXRlc3RWZXJzaW9ufVxuICovXG5leHBvcnQgY2xhc3MgQ3VycmVudFZlcnNpb25GaW5kZXIgaW1wbGVtZW50cyBJRmluZEN1cnJlbnRWZXJzaW9uIHtcblxuICAgIC8qKlxuICAgICAqIEluc3RhbnRpYXRlcyBhbiBpbnN0YW5jZSBvZiB7R2l0aHViVmVyc2lvblRhZ3N9LlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgX3ZlcnNpb25Tb3J0ZXI6IElWZXJzaW9uU29ydGVyLCBwcml2YXRlIHJlYWRvbmx5IF9jb250ZXh0OiBDb250ZXh0LCBwcml2YXRlIHJlYWRvbmx5IF9naXRodWI6IEluc3RhbmNlVHlwZTx0eXBlb2YgR2l0SHViPiAsIHByaXZhdGUgcmVhZG9ubHkgX2xvZ2dlcjogSUxvZ2dlcikge31cblxuICAgIC8qKlxuICAgICAqIEBpbmhlcml0ZG9jXG4gICAgICovXG4gICAgYXN5bmMgZmluZChwcmVyZWxlYXNlSWRlbnRpZmllcj86IHN0cmluZyk6IFByb21pc2U8U2VtVmVyPiB7XG4gICAgICAgIGNvbnN0IHtvd25lciwgcmVwb30gPSB0aGlzLl9jb250ZXh0LnJlcG87XG4gICAgICAgIHRoaXMuX2xvZ2dlci5kZWJ1ZyhgR2V0dGluZyB2ZXJzaW9uIHRhZ3MgZnJvbSBnaXRodWIuY29tLyR7b3duZXJ9LyR7cmVwb30ke3ByZXJlbGVhc2VJZGVudGlmaWVyICE9PSB1bmRlZmluZWQgPyBgIHdpdGggcHJlcmVsZWFzZSBpZGVudGlmaWVyICcke3ByZXJlbGVhc2VJZGVudGlmaWVyfSdgIDogJyd9YCk7XG4gICAgICAgIGxldCB2ZXJzaW9ucyA9IGF3YWl0IHRoaXMuX2dldFZlcnNpb25zRnJvbVJlcG9UYWdzKG93bmVyLCByZXBvKTtcbiAgICAgICAgaWYgKCF2ZXJzaW9ucyB8fCB2ZXJzaW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRWZXJzaW9uID0gdGhpcy5fZ2V0RGVmYXVsdFZlcnNpb24ocHJlcmVsZWFzZUlkZW50aWZpZXIpO1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oYE5vIHZlcnNpb24gdGFncy4gRGVmYXVsdGluZyB0byB2ZXJzaW9uICR7ZGVmYXVsdFZlcnNpb259YCk7XG4gICAgICAgICAgICByZXR1cm4gZGVmYXVsdFZlcnNpb247XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJlcmVsZWFzZUlkZW50aWZpZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdmVyc2lvbnMgPSB2ZXJzaW9ucy5maWx0ZXIoXyA9PiBfLnByZXJlbGVhc2UubGVuZ3RoID4gMCAmJiBfLnByZXJlbGVhc2VbMF0gPT09IHByZXJlbGVhc2VJZGVudGlmaWVyKTtcbiAgICAgICAgICAgIGlmICh2ZXJzaW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZWZhdWx0VmVyc2lvbiA9IHRoaXMuX2dldERlZmF1bHRWZXJzaW9uKHByZXJlbGVhc2VJZGVudGlmaWVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhgTm8gdmVyc2lvbiB0YWcgd2l0aCBwcmVyZWxlYXNlIGlkZW50aWZpZXIgJyR7cHJlcmVsZWFzZUlkZW50aWZpZXJ9JyB3YXMgZm91bmQuIERlZmF1bHRpbmcgdG8gdmVyc2lvbiAke2RlZmF1bHRWZXJzaW9ufWApO1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWZhdWx0VmVyc2lvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvZ2dlci5kZWJ1ZyhgVmVyc2lvbiB0YWdzOiBbXG4ke3ZlcnNpb25zLmpvaW4oJyxcXG4nKX1cbl1gKTtcblxuICAgICAgICBjb25zdCBjdXJyZW50VmVyc2lvbiA9IHRoaXMuX3ZlcnNpb25Tb3J0ZXIuc29ydCh2ZXJzaW9ucywgdHJ1ZSlbMF07XG4gICAgICAgIGlmICghc2VtdmVyLnZhbGlkKGN1cnJlbnRWZXJzaW9uKSkgdGhyb3cgbmV3IEVycm9yKGAke2N1cnJlbnRWZXJzaW9ufSBpcyBub3QgYSB2YWxpZCBTZW1WZXIgdmVyc2lvbmApO1xuICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhgQ3VycmVudCB2ZXJzaW9uICcke2N1cnJlbnRWZXJzaW9ufSdgKTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRWZXJzaW9uO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgX2dldFZlcnNpb25zRnJvbVJlcG9UYWdzKG93bmVyOiBzdHJpbmcsIHJlcG86IHN0cmluZyk6IFByb21pc2U8U2VtVmVyW10+IHtcbiAgICAgICAgY29uc3QgdmVyc2lvbnMgPSBhd2FpdCB0aGlzLl9naXRodWIucGFnaW5hdGUoXG4gICAgICAgICAgICB0aGlzLl9naXRodWIucmVwb3MubGlzdFRhZ3MsXG4gICAgICAgICAgICB7b3duZXIsIHJlcG99LFxuICAgICAgICAgICAgcmVzcG9uc2UgPT4gcmVzcG9uc2UuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcih0YWcgPT4gc2VtdmVyLnZhbGlkKHRhZy5uYW1lKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoXyA9PiBfLm5hbWUhKSk7XG5cbiAgICAgICAgcmV0dXJuIHZlcnNpb25zLm1hcChfID0+IHNlbXZlci5wYXJzZShfKSEpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2dldERlZmF1bHRWZXJzaW9uKHByZXJlbGVhc2VJZGVudGlmaWVyPzogc3RyaW5nKTogU2VtVmVyIHtcbiAgICAgICAgaWYgKHByZXJlbGVhc2VJZGVudGlmaWVyID09PSB1bmRlZmluZWQpIHJldHVybiBuZXcgU2VtVmVyKCcxLjAuMCcpO1xuICAgICAgICByZXR1cm4gbmV3IFNlbVZlcihgMS4wLjAtJHtwcmVyZWxlYXNlSWRlbnRpZmllcn0uMGApO1xuICAgIH1cbn1cbiJdfQ==
