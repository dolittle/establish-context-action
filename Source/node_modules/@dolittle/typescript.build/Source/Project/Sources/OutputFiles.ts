/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import path from 'path';
import toUnixPath from 'slash';
import { YarnWorkspace, Globs, StaticFiles, createGlobPatterns } from '../../internal';

/**
 * Represents the files that are outputted
 *
 * @export
 * @class OutputFiles
 */
export class OutputFiles {

    static get FOLDER_NAME() { return 'Distribution'; }

    static declarationFilesGlobPatterns = ['**/*.d.ts'];
    static compiledSourceFilesGlobPatterns = ['**/*.js'];
    static compiledTestFilesGlobPatterns = ['**/for_*/**/!(given)/*.js', '**/for_*/*.js'];

    /**
     * Instantiates an instance of {OutputFiles}.
     * @param {string} _projectRootFolder
     * @param {YarnWorkspace[]} [_workspaces=[]]
     */
    constructor(private _projectRootFolder: string, private _workspaces: YarnWorkspace[] = []) {
        this.root = this._workspaces.length > 0 ? undefined : path.join(this._projectRootFolder, OutputFiles.FOLDER_NAME);

        this.compiledFilesGlobs = this.createCompiledFileGlobs(...OutputFiles.compiledSourceFilesGlobPatterns);
        this.staticOutputFileGlobs = this.createCompiledFileGlobs(...StaticFiles.staticOutputFilesGlobPatterns);
        this.declarationFilesGlobs = this.createCompiledFileGlobs(...OutputFiles.declarationFilesGlobPatterns);
        this.compiledTestsGlobs = this.createCompiledFileGlobs(...OutputFiles.compiledTestFilesGlobPatterns);
    }

    /**
     * The absolute path to the output folder of this project. If this project has workspaces this field is undefined
     *
     * @readonly
     */
    readonly root?: string;

    /**
     * The globs for all the compiled files in the project
     *
     * @readonly
     */
    readonly compiledFilesGlobs: Globs;


    /**
     * The globs for all the static output files
     *
     * @readonly
     */
    readonly staticOutputFileGlobs: Globs;

    /**
     * The globs for the declaration files in the project
     *
     * @readonly
     */
    readonly declarationFilesGlobs: Globs;

    /**
     * The globs for all compiled tests in the project.
     *
     * @readonly
     */
    readonly compiledTestsGlobs: Globs;

    private createCompiledFileGlobs(...globPatterns: string[]) {
        const globs: Globs = {
            includes: [],
            excludes: []
        };
        if (this._workspaces.length > 0) {
            this._workspaces.forEach(_ => {
                globs.includes.push(...createGlobPatterns(_.sources.outputFiles.root!, globPatterns, _.sources.outputFiles.root! === this._projectRootFolder ? '' : toUnixPath(_.sources.outputFiles.root!.replace(`${this._projectRootFolder}${path.sep}`, ''))));
            });
        } else {
            globs.includes.push(...createGlobPatterns(this.root!, globPatterns, OutputFiles.FOLDER_NAME));
        }
        return globs;
    }

}
