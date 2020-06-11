/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import fs from 'fs';
import path from 'path';
import isValidPath from 'is-valid-path';
import { NoPackageJson, PathIsNotDirectory } from '../internal';

export type PackageObject = {
    /**
     * Name of the package
     *
     * @type {string}
     */
    name: string,
    /**
     * Version of the package
     *
     * @type {string}
     */
    version: string,
    /**
     * Yarn workspaces field
     *
     * @type {string[]}
     */
    workspaces?: string[]
};

/**
 * Represents an npm package
 *
 * @export
 * @class Package
 */
export class Package {

    static get PACKAGE_NAME() { return 'package.json'; }
    static get WEBPACK_CONFIG_NAME() {return 'webpack.config.js'; }

    /**
     * Instantiates an instance of {Package}.
     * @param {string} _rootFolder Path to the root of the project containing a package.json file
     * @param {Package} [_parentPackage] The parent {Package} if this {Package} is a yarn workspace
     */
    constructor(rootFolder: string, private _parentPackage?: Package) {
        if (!isValidPath(rootFolder) || !fs.statSync(rootFolder).isDirectory())
            throw new PathIsNotDirectory(rootFolder);
        this.rootFolder = path.resolve(rootFolder);
        this.path = path.join(rootFolder, Package.PACKAGE_NAME);
        if (!fs.existsSync(this.path))
            throw new NoPackageJson(this.path);

        this.packageObject = JSON.parse(fs.readFileSync(this.path) as any);

        const webpackConfigPath = path.join(this.rootFolder, Package.WEBPACK_CONFIG_NAME);
        if (fs.existsSync(webpackConfigPath)) {
            this.webpackConfigPath = webpackConfigPath;
        }
    }

    /**
     * Gets the absolute path to the package.json
     *
     * @readonly
     */
    readonly path: string;

    /**
     * Gets the absolute path to the folder
     *
     * @readonly
     */
    readonly rootFolder: string;

    /**
     * Gets the package.json object
     *
     * @readonly
     */
    readonly packageObject: PackageObject;

    /**
     * The path to the webpack configuration, if it exists
     *
     * @type {string}
     */
    readonly webpackConfigPath?: string;

    /**
     * Gets the parent package for this yarn workspace
     *
     * @readonly
     */
    get parentPackage() {
        return this._parentPackage;
    }

    /**
     * Whether or not this is yarn workspaces root package
     *
     * @returns
     */
    hasWorkspaces() {
        return this.packageObject.workspaces !== undefined;
    }

    /**
     * Whether or not this package uses webpack
     *
     * @returns
     */
    usesWebpack() {
        return this.webpackConfigPath !== undefined;
    }
}
