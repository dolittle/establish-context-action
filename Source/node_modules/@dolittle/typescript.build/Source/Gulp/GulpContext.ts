/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Project } from '../internal';

export class GulpContext {
    private _project: Project;

    /**
     * Initializes a new instance of {GulpContext}
     */
    constructor() {
        process.chdir(process.env.PWD || process.env.INIT_CWD!);
        this._project = new Project(process.env.PWD);
    }

    /**
     * Gets the {Project} that holds all the meta data for the current project
     *
     * @readonly
     */
    get project() {
        return this._project;
    }
}
