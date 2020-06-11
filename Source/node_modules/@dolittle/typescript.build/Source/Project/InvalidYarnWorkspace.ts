/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

/**
 * The exception that gets thrown when a {YarnWorkspace} structure couldn't be created
 *
 * @export
 * @class InvalidYarnWorkspace
 * @extends {Exception}
 */
export class InvalidYarnWorkspace extends Error {
    /**
     * Instantiates an instance of {InvalidYarnWorkspace}.
     * @param {string} path
     */
    constructor(path: string, innerError?: Error) {
        super(`Could not create YarnWorkspace structure. Invalid yarn workspace at path '${path}'. ${innerError ? `Inner error message: ${innerError.message}` : ''}`);
    }
}
