/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import path from 'path';
import glob from 'glob';
import isGlob from 'is-glob';
import fs from 'fs';
import { Package, Sources, YarnWorkspace, InvalidYarnWorkspace } from '../internal';

/**
 * Represents a project
 *
 * @export
 * @class Project
 */
export class Project {

    private _workspaces: YarnWorkspace[] = [];

    /**
     * Instantiates an instance of {Project}.
     * @param {string} [root] The root folder of the project
     */
    constructor(root?: string) {
        this.root = root !== undefined ? path.resolve(root) : process.cwd();
        this.rootPackage = new Package(this.root);
        this.tsLint = fs.existsSync(path.join(this.root, 'tslint.json')) ?
                        path.join(this.root, 'tslint.json')
                        : path.join(this.root, 'node_modules', '@dolittle', 'typescript.build', 'TSConfig', 'tslint.json');

        if (this.rootPackage.hasWorkspaces()) {
            this.createWorkspaces();
        }

        this.sources = new Sources(this.root, this.rootPackage, this._workspaces);
    }

    /**
     * Gets the absolute path to the root folder
     *
     * @readonly
     */
    readonly root: string;

    /**
     * Gets the root {Package} for this project
     *
     * @readonly
     */
    readonly rootPackage: Package;

    /**
     * Gets the {ProjectSources} for this project
     *
     * @readonly
     */
    readonly sources: Sources;

    /**
     * The absolute path to the tslint configuration for this project.
     *
     * @type {string}
     */
    readonly tsLint: string;

    /**
     * Gets the {YarnWorkspace} configuration for each yarn workspace in the project
     *
     * @readonly
     */
    get workspaces() {
        return this._workspaces;
    }

    /**
     * Whether or not this project has yarn workspaces
     *
     * @returns
     */
    hasWorkspaces() {
        return this._workspaces !== undefined && this._workspaces.length > 0;
    }

    private createWorkspaces() {
        this._workspaces = [];
        const rootPackageObject = this.rootPackage.packageObject;
        rootPackageObject.workspaces!.forEach(workspace => {
            if (isGlob(workspace)) {
                glob.sync(workspace, {absolute: true, }).forEach(workspacePath => {
                    try {
                        if (fs.statSync(workspacePath).isDirectory()) {
                            const workspacePackage = new Package(workspacePath, this.rootPackage);
                            const workspaceSources = new Sources(workspacePackage.rootFolder, workspacePackage);
                            this._workspaces.push(new YarnWorkspace(workspacePackage, workspaceSources, this.tsLint));
                        }
                    } catch (error) {
                        throw new InvalidYarnWorkspace(workspacePath, error);
                    }
                });
            }
            else {
                try {
                    if (fs.statSync(workspace).isDirectory()) {
                        const workspacePackage = new Package(workspace, this.rootPackage);
                        const workspaceSources = new Sources(workspacePackage.rootFolder, workspacePackage);
                        this._workspaces.push(new YarnWorkspace(workspacePackage, workspaceSources, this.tsLint));
                    }
                } catch (error) {
                    throw new InvalidYarnWorkspace(workspace, error);
                }
            }
        });
    }
}
