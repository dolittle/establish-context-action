/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import fs from 'fs';
import path from 'path';
import { Package, Sources } from '../internal';

/**
 * Represents a yarn workspace
 *
 * @export
 * @class YarnWorkspace
 */
export class YarnWorkspace {

    constructor(private _workspacePackage: Package, private _sources: Sources, tsLint: string) {
        this.tsLint = fs.existsSync(path.join(this.sources.root, 'tslint.json')) ?
                        path.join(this.sources.root, 'tslint.json')
                        : tsLint;
    }

    /**
     * The absolute path to the tslint configuration for this project.
     *
     * @type {string}
     */
    readonly tsLint: string;

    /**
     * Gets the {ProjectSources} for this yarn workspace
     *
     * @readonly
     */
    get sources() {
        return this._sources;
    }

    /**
     * Gets the {Package} for this yarn workspace
     *
     * @readonly
     */
    get workspacePackage() {
        return this._workspacePackage;
    }
}
