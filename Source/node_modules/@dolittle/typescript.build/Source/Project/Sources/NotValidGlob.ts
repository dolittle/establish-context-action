/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
/**
 * The exception that gets thrown when a glob pattern is not valid
 *
 * @export
 * @class NotValidGlob
 * @extends {Exception}
 */
export class NotValidGlob extends Error {
    /**
     * Instantiates an instance of {NotValidGlob}.
     * @param {string} pattern
     */
    constructor(pattern: string) {
        super(`The pattern '${pattern}' is not a valid glob pattern`);
    }
}
