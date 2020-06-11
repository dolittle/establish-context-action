/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import fs from 'fs';
import path from 'path';
import toUnixPath from 'slash';
import { YarnWorkspace, Globs, toPatternsThatIgnoreNodeModules, asPossibleFileExtensionsPattern, createGlobPatterns, globAsAbsoluteGlob, StaticFiles, Package } from '../../internal';


/**
 * Represents the source files
 *
 * @export
 * @class SourceFiles
 */
export class SourceFiles {
    /**
     * The name that the Source folder should have, if any
     *
     * @readonly
     * @static
     */
    static get FOLDER_NAME() { return 'Source'; }

    /**
     * The list of valid source file extensions
     *
     * @readonly
     * @static
     */
    static get FILE_EXTENSIONS() { return ['ts', 'js']; }

    /**
     * The patterns to exclude that are common to webpack projects
     *
     * @static
     */
    static webpackSpecificPatternsToExclude = [
        'Configurations/**/*', 'Scripts/**/*'
    ];

    /**
     * Gets the relative patterns to exclude that are specific for webpack based on the project package
     *
     * @static
     * @param {Package} rootPackage
     * @returns
     */
    static getWebpackSpecificExcludes(rootPackage: Package) {
        const excludes: string[] = [];
        if (rootPackage.usesWebpack()) {
            const outputFolder = path.basename(require(rootPackage.webpackConfigPath!)().output.path);
            excludes.push(`${outputFolder}/**/*`, ...SourceFiles.webpackSpecificPatternsToExclude);
        }
        return excludes;
    }

    /**
     * The list of files that should not be considered a part of the source files
     *
     * @static
     */
    static filesToIgnore = [
        'wallaby.config.js','wallaby.conf.js', 'wallaby.js', 'Gulpfile.js', 'gulpfile.js', 'webpack.config.js', 'webpack.conf.js', 'webpack.js', 'webpack.prod.config.js', 'webpack.prod.conf.js', 'webpack.prod.js',
        'mocha.options.js', 'mocha.opts.js', 'mocha.js', 'run.js', 'nginx-default.conf', 'tsconfig.json', 'tsconfig.settings.json', 'package.json', 'package-lock.json', 'yarn.lock'
    ];

    /**
     * The list of source file glob patterns
     *
     * @static
     */
    static sourceFilesGlobPatterns = toPatternsThatIgnoreNodeModules(`*${asPossibleFileExtensionsPattern(SourceFiles.FILE_EXTENSIONS)}`);


    /**
     * The list of test source file glob patterns
     *
     * @static
     */
    static testFilesGlobPatterns = [
        ...toPatternsThatIgnoreNodeModules(`for_*/**/!(given)/*${asPossibleFileExtensionsPattern(SourceFiles.FILE_EXTENSIONS)}`),
        ...toPatternsThatIgnoreNodeModules(`for_*/*${asPossibleFileExtensionsPattern(SourceFiles.FILE_EXTENSIONS)}`)
    ];
    /**
     * The list of test setup source file glob patterns
     *
     * @static
     */
    static testSetupFilesGlobPatterns = [
        ...toPatternsThatIgnoreNodeModules(`for_*/**/given/**/*${asPossibleFileExtensionsPattern(SourceFiles.FILE_EXTENSIONS)}`)
    ];

    private _underSourceFolder: boolean = false;
    /**
     * Instantiates an instance of {SourceFiles}.
     * @param {string} _projectRootFolder
     * @param {YarnWorkspace[]} [_workspaces=[]]
     */
    constructor(private _projectRootFolder: string, private _rootPackage: Package, private _workspaces: YarnWorkspace[] = []) {
        this.root = this._projectRootFolder;

        const sourceFolder = path.resolve(this._projectRootFolder, SourceFiles.FOLDER_NAME);
        if (fs.existsSync(sourceFolder) && fs.statSync(sourceFolder).isDirectory()) {
            this._underSourceFolder = true;
            this.root = sourceFolder;
        }

        this.sourceFileGlobs = this.createSourceFileGlobs(...SourceFiles.sourceFilesGlobPatterns);
        this.staticSourceFileGlobs = this.createSourceFileGlobs(...StaticFiles.staticSourceFilesGlobPatterns);
        this.testFileGlobs = this.createSourceFileGlobs(...SourceFiles.testFilesGlobPatterns);
        this.testSetupFileGlobs = this.createSourceFileGlobs(...SourceFiles.testSetupFilesGlobPatterns);
    }

    /**
     * The root folder for the source files
     *
     * @readonly
     */
    readonly root: string;

    /**
     * The globs for all the source files
     *
     * @readonly
     */
    readonly sourceFileGlobs: Globs;

    /**
     * The globs for all the static source files
     *
     * @readonly
     */
    readonly staticSourceFileGlobs: Globs;

    /**
     * The globs for all test files
     *
     * @readonly
     */
    readonly testFileGlobs: Globs;

    /**
     * The globs for all the test setup files
     *
     * @readonly
     */
    readonly testSetupFileGlobs: Globs;

    private createSourceFileGlobs(...globPatterns: string[]) {
        const globs: Globs = {
            includes: [],
            excludes: []
        };
        if (this._workspaces.length > 0) this._workspaces.forEach(_ => {
            globs.includes.push(...createGlobPatterns(_.sources.sourceFiles.root, globPatterns, _.sources.sourceFiles.root === this._projectRootFolder ? '' : toUnixPath(_.sources.sourceFiles.root.replace(`${this._projectRootFolder}${path.sep}`, ''))));
        });
        else globs.includes.push(...createGlobPatterns(this.root, globPatterns, this._underSourceFolder === true ? SourceFiles.FOLDER_NAME : undefined));

        const excludePatterns = ['node_modules/**/*', '**/node_modules/**/*', ...SourceFiles.getWebpackSpecificExcludes(this._rootPackage), ...SourceFiles.filesToIgnore];
        excludePatterns.forEach(globPattern => {
            globs.excludes.push({relative: globPattern, absolute: globAsAbsoluteGlob(this._projectRootFolder, globPattern)});
        });
        return globs;
    }

}
