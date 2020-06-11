/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import toUnixPath from 'slash';
import isGlob from 'is-glob';

/**
 * Represents a glob pattern in both relative and absolute form
 */
export type GlobPattern = {
    /**
     * A relative pattern
     *
     * @type {string}
     */
    relative: string,

    /**
     * An absolute pattern
     *
     * @type {string}
     */
    absolute: string
};

/**
 * Represents glob patterns
 */
export type Globs = {
    includes: GlobPattern[],
    excludes: GlobPattern[];
};
/**
 * Returns a glob pattern as a glob pattern with absolute path instead of relative.
 *
 * @export
 * @param {string} rootFolder The root folder where the the relative glob is supposed to be used from
 * @param {string} glob The relative glob pattern
 * @returns
 */
export function globAsAbsoluteGlob(rootFolder: string, glob: string) {
    return `${toUnixPath(rootFolder)}/${glob}`;
}

/**
 * Transforms a pattern into multiple patterns for avoiding files under node_modules
 *
 * @export
 * @param {string} pattern
 * @returns
 */
export function toPatternsThatIgnoreNodeModules(pattern: string) {
    return [
        pattern,
        `**/!(node_modules)/**/${pattern}`,
        `**/!(node_modules)/${pattern}`
    ];
}

/**
 * Creates glob patterns for matching one or more file extensions
 *
 * @export
 * @param {string[]} fileExtensions
 * @returns
 */
export function asPossibleFileExtensionsPattern(fileExtensions: string[], negate: boolean = false) {
    if (fileExtensions.length <= 0) throw new Error('No file extension to create pattern from');
    return `.${negate === true ? '!' : '@'}(${fileExtensions.join('|')})`;
}

/**
 * Creates glob patterns
 *
 * @export
 * @param {string} rootFolderAbsolutePath
 * @param {string[]} globPatterns
 * @param {string} [folderName] The name of the folder where the files live under. Used for the relative glob pattern
 * @returns
 */
export function createGlobPatterns(rootFolderAbsolutePath: string, globPatterns: string[], folderName?: string) {
    const result: GlobPattern[] = [];
    globPatterns.forEach(globPattern => {
        if (!isGlob(globPattern)) throw new Error(`'${globPattern}' is not a valid glob pattern`);
        result.push({relative: `${folderName ? `${folderName}/` : ''}${globPattern}`, absolute: globAsAbsoluteGlob(rootFolderAbsolutePath, globPattern)});
    });
    return result;
}
