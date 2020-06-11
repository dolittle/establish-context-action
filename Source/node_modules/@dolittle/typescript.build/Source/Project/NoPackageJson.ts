/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
/**
 * The exception that gets thrown when package.json was not found at the expected path
 *
 * @export
 * @class NoPackageJson
 * @extends {Exception}
 */
export class NoPackageJson extends Error {
    /**
     * Instantiates an instance of {NoPackageJson}.
     * @param {string} path
     */
    constructor(path: string) {
        super(`Could not find package.json at path '${path}'`);
    }
}
