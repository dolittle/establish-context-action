"use strict";
// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseTypeExtractor = void 0;
const prioritizedReleaseTypes = [
    'major',
    'minor',
    'patch',
    'premajor',
    'preminor',
    'prepatch',
    'prerelease'
];
/**
 * Represents an implementation of {IReleaseTypeExtractor}
 *
 * @export
 * @class ReleaseTypeExtractor
 * @implements {IReleaseTypeExtractor}
 */
class ReleaseTypeExtractor {
    /**
     * Instantiating an instance of {ReleaseTypeExtractor}.
     * @param {ILogger} _logger
     */
    constructor(_logger) {
        this._logger = _logger;
    }
    /**
     * @inheritdoc
     */
    extract(labels) {
        if (labels === undefined)
            return undefined;
        this._logger.debug(`Extracting release type from list of labels: [${labels.join(', ')}]`);
        labels = labels.map(_ => _.trim());
        for (const releaseType of prioritizedReleaseTypes) {
            const foundReleaseType = labels.find(_ => _ === releaseType);
            if (foundReleaseType !== undefined)
                return foundReleaseType;
        }
        return undefined;
    }
}
exports.ReleaseTypeExtractor = ReleaseTypeExtractor;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNvdXJjZS9SZWxlYXNlVHlwZS9SZWxlYXNlVHlwZUV4dHJhY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0NBQStDO0FBQy9DLHFHQUFxRzs7O0FBTXJHLE1BQU0sdUJBQXVCLEdBQWtCO0lBQzNDLE9BQU87SUFDUCxPQUFPO0lBQ1AsT0FBTztJQUNQLFVBQVU7SUFDVixVQUFVO0lBQ1YsVUFBVTtJQUNWLFlBQVk7Q0FDZixDQUFDO0FBRUY7Ozs7OztHQU1HO0FBQ0gsTUFBYSxvQkFBb0I7SUFFN0I7OztPQUdHO0lBQ0gsWUFBb0IsT0FBZ0I7UUFBaEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztJQUFHLENBQUM7SUFFeEM7O09BRUc7SUFDSCxPQUFPLENBQUMsTUFBZ0I7UUFDcEIsSUFBSSxNQUFNLEtBQUssU0FBUztZQUFFLE9BQU8sU0FBUyxDQUFDO1FBQzNDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGlEQUFpRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxRixNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ25DLEtBQUssTUFBTSxXQUFXLElBQUksdUJBQXVCLEVBQUU7WUFDL0MsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLFdBQVcsQ0FBNEIsQ0FBQztZQUN4RixJQUFJLGdCQUFnQixLQUFLLFNBQVM7Z0JBQUUsT0FBTyxnQkFBZ0IsQ0FBQztTQUMvRDtRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7Q0FFSjtBQXRCRCxvREFzQkMiLCJmaWxlIjoiUmVsZWFzZVR5cGUvUmVsZWFzZVR5cGVFeHRyYWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIERvbGl0dGxlLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLiBTZWUgTElDRU5TRSBmaWxlIGluIHRoZSBwcm9qZWN0IHJvb3QgZm9yIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbi5cblxuaW1wb3J0IHsgUmVsZWFzZVR5cGUgfSBmcm9tICdzZW12ZXInO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gJ0Bkb2xpdHRsZS9naXRodWItYWN0aW9ucy5zaGFyZWQubG9nZ2luZyc7XG5pbXBvcnQgeyBJUmVsZWFzZVR5cGVFeHRyYWN0b3IgfSBmcm9tICcuL0lSZWxlYXNlVHlwZUV4dHJhY3Rvcic7XG5cbmNvbnN0IHByaW9yaXRpemVkUmVsZWFzZVR5cGVzOiBSZWxlYXNlVHlwZVtdID0gW1xuICAgICdtYWpvcicsXG4gICAgJ21pbm9yJyxcbiAgICAncGF0Y2gnLFxuICAgICdwcmVtYWpvcicsXG4gICAgJ3ByZW1pbm9yJyxcbiAgICAncHJlcGF0Y2gnLFxuICAgICdwcmVyZWxlYXNlJ1xuXTtcblxuLyoqXG4gKiBSZXByZXNlbnRzIGFuIGltcGxlbWVudGF0aW9uIG9mIHtJUmVsZWFzZVR5cGVFeHRyYWN0b3J9XG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIFJlbGVhc2VUeXBlRXh0cmFjdG9yXG4gKiBAaW1wbGVtZW50cyB7SVJlbGVhc2VUeXBlRXh0cmFjdG9yfVxuICovXG5leHBvcnQgY2xhc3MgUmVsZWFzZVR5cGVFeHRyYWN0b3IgaW1wbGVtZW50cyBJUmVsZWFzZVR5cGVFeHRyYWN0b3Ige1xuXG4gICAgLyoqXG4gICAgICogSW5zdGFudGlhdGluZyBhbiBpbnN0YW5jZSBvZiB7UmVsZWFzZVR5cGVFeHRyYWN0b3J9LlxuICAgICAqIEBwYXJhbSB7SUxvZ2dlcn0gX2xvZ2dlclxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2xvZ2dlcjogSUxvZ2dlcikge31cblxuICAgIC8qKlxuICAgICAqIEBpbmhlcml0ZG9jXG4gICAgICovXG4gICAgZXh0cmFjdChsYWJlbHM6wqBzdHJpbmdbXSk6IFJlbGVhc2VUeXBlIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgaWYgKGxhYmVscyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9sb2dnZXIuZGVidWcoYEV4dHJhY3RpbmcgcmVsZWFzZSB0eXBlIGZyb20gbGlzdCBvZiBsYWJlbHM6IFske2xhYmVscy5qb2luKCcsICcpfV1gKTtcbiAgICAgICAgbGFiZWxzID0gbGFiZWxzLm1hcChfID0+IF8udHJpbSgpKTtcbiAgICAgICAgZm9yIChjb25zdCByZWxlYXNlVHlwZSBvZiBwcmlvcml0aXplZFJlbGVhc2VUeXBlcykge1xuICAgICAgICAgICAgY29uc3QgZm91bmRSZWxlYXNlVHlwZSA9IGxhYmVscy5maW5kKF8gPT4gXyA9PT0gcmVsZWFzZVR5cGUpIGFzIFJlbGVhc2VUeXBlIHzCoHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmIChmb3VuZFJlbGVhc2VUeXBlICE9PSB1bmRlZmluZWQpIHJldHVybiBmb3VuZFJlbGVhc2VUeXBlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG59XG4iXX0=
