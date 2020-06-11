/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { toPatternsThatIgnoreNodeModules, asPossibleFileExtensionsPattern } from '../../internal';

/**
 * Represents the static files
 *
 * @export
 * @class StaticFiles
 */
export class StaticFiles {

    static get NOT_STATIC_FILE_EXTENSIONS() { return ['js', 'ts', 'd.ts']; }

    /**
     * The list of static source file glob patterns
     *
     * @static
     */
    static staticSourceFilesGlobPatterns = toPatternsThatIgnoreNodeModules(`*${asPossibleFileExtensionsPattern(StaticFiles.NOT_STATIC_FILE_EXTENSIONS, true)}`);

    static  staticOutputFilesGlobPatterns = [`**/*${asPossibleFileExtensionsPattern(StaticFiles.NOT_STATIC_FILE_EXTENSIONS, true)}`];
}
