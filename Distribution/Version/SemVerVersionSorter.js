"use strict";
// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemVerVersionSorter = void 0;
const semver_1 = __importDefault(require("semver"));
/**
 * Represents an implementation of {IVersionSorter} that can sort versions according to SemVer
 *
 * @export
 * @class SemVerVersionSorter
 * @implements {IVersionSorter}
 */
class SemVerVersionSorter {
    /**
     * Instantiates an instance of {SemVerVersionSorter}.
     * @param {ILogger} _logger
     */
    constructor(_logger) {
        this._logger = _logger;
    }
    /**
     * @inheritdoc
     */
    sort(versions, descending = true) {
        this._logger.debug('Sorting versions...');
        if (versions === undefined)
            return [];
        versions.forEach(_ => {
            if (!semver_1.default.valid(_))
                throw new Error(`${_} is not a valid SemVer version`);
        });
        return descending ? semver_1.default.rsort(versions) : semver_1.default.sort(versions);
    }
}
exports.SemVerVersionSorter = SemVerVersionSorter;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNvdXJjZS9WZXJzaW9uL1NlbVZlclZlcnNpb25Tb3J0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtDQUErQztBQUMvQyxxR0FBcUc7Ozs7OztBQUdyRyxvREFBd0M7QUFHeEM7Ozs7OztHQU1HO0FBQ0gsTUFBYSxtQkFBbUI7SUFFNUI7OztPQUdHO0lBQ0gsWUFBb0IsT0FBZ0I7UUFBaEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztJQUFJLENBQUM7SUFFekM7O09BRUc7SUFDSCxJQUFJLENBQUMsUUFBa0IsRUFBRSxhQUFzQixJQUFJO1FBQy9DLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDMUMsSUFBSSxRQUFRLEtBQUssU0FBUztZQUFFLE9BQU8sRUFBRSxDQUFDO1FBQ3RDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDakIsSUFBSSxDQUFDLGdCQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQ2hGLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxVQUFVLENBQUMsQ0FBQyxDQUFDLGdCQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN2RSxDQUFDO0NBRUo7QUFwQkQsa0RBb0JDIiwiZmlsZSI6IlZlcnNpb24vU2VtVmVyVmVyc2lvblNvcnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgRG9saXR0bGUuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIGZpbGUgaW4gdGhlIHByb2plY3Qgcm9vdCBmb3IgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uLlxuXG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSAnQGRvbGl0dGxlL2dpdGh1Yi1hY3Rpb25zLnNoYXJlZC5sb2dnaW5nJztcbmltcG9ydCBzZW12ZXIsIHsgU2VtVmVyIH0gZnJvbSAnc2VtdmVyJztcbmltcG9ydCB7IElWZXJzaW9uU29ydGVyIH0gZnJvbSAnLi9JVmVyc2lvblNvcnRlcic7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhbiBpbXBsZW1lbnRhdGlvbiBvZiB7SVZlcnNpb25Tb3J0ZXJ9IHRoYXQgY2FuIHNvcnQgdmVyc2lvbnMgYWNjb3JkaW5nIHRvIFNlbVZlclxuICpcbiAqIEBleHBvcnRcbiAqIEBjbGFzcyBTZW1WZXJWZXJzaW9uU29ydGVyXG4gKiBAaW1wbGVtZW50cyB7SVZlcnNpb25Tb3J0ZXJ9XG4gKi9cbmV4cG9ydCBjbGFzcyBTZW1WZXJWZXJzaW9uU29ydGVyIGltcGxlbWVudHMgSVZlcnNpb25Tb3J0ZXIge1xuXG4gICAgLyoqXG4gICAgICogSW5zdGFudGlhdGVzIGFuIGluc3RhbmNlIG9mIHtTZW1WZXJWZXJzaW9uU29ydGVyfS5cbiAgICAgKiBAcGFyYW0ge0lMb2dnZXJ9IF9sb2dnZXJcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9sb2dnZXI6IElMb2dnZXIgKSB7fVxuXG4gICAgLyoqXG4gICAgICogQGluaGVyaXRkb2NcbiAgICAgKi9cbiAgICBzb3J0KHZlcnNpb25zOiBTZW1WZXJbXSwgZGVzY2VuZGluZzogYm9vbGVhbiA9IHRydWUpIHtcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmRlYnVnKCdTb3J0aW5nIHZlcnNpb25zLi4uJyk7XG4gICAgICAgIGlmICh2ZXJzaW9ucyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gW107XG4gICAgICAgIHZlcnNpb25zLmZvckVhY2goXyA9PiB7XG4gICAgICAgICAgICBpZiAoIXNlbXZlci52YWxpZChfKSkgdGhyb3cgbmV3IEVycm9yKGAke199IGlzIG5vdCBhIHZhbGlkIFNlbVZlciB2ZXJzaW9uYCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGVzY2VuZGluZyA/IHNlbXZlci5yc29ydCh2ZXJzaW9ucykgOiBzZW12ZXIuc29ydCh2ZXJzaW9ucyk7XG4gICAgfVxuXG59XG4iXX0=
