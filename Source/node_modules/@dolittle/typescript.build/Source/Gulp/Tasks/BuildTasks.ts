/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import gulp from 'gulp';
import gulpSourcemaps from 'gulp-sourcemaps';
import gulpTypescript from 'gulp-typescript';
import { TaskFunction } from 'undertaker';
import { Readable } from 'stream';
import { GulpContext, getCleanTasks, createTask, getLintTasks } from '../../internal';


export class BuildTasks {
    static buildTasks: BuildTasks;

    private _buildTask!: TaskFunction;
    private _buildNoLintTask!: TaskFunction;
    private _copyStaticTask!: TaskFunction;

    constructor(private _context: GulpContext) {}

    get buildTask() {
        if (this._buildTask === undefined) {
            this._buildTask = this.createBuildTask(true);
        }
        return this._buildTask;
    }

    get buildNoLintTask() {
        if (this._buildNoLintTask === undefined) {
            this._buildNoLintTask = this.createBuildTask(false);
        }
        return this._buildNoLintTask;
    }

    get allTasks() {
        return [this.buildTask, this.buildNoLintTask];
    }

    private createBuildTask(lint: boolean) {
        let task: TaskFunction;
        const taskSeries = [getCleanTasks(this._context).cleanTask];
        if (lint) taskSeries.push(getLintTasks(this._context).lintTask);

        if (this._context.project.workspaces.length > 0) taskSeries.push(this.createWorkspacesBuildTask(lint));
        else {
                const projectSources = this._context.project.sources;
                const tsProject = gulpTypescript.createProject(projectSources.tsConfig!);
                const sourceFiles = projectSources.sourceFiles.sourceFileGlobs.includes.map(_ => _.absolute);
                const excludedSourceFiles = projectSources.sourceFiles.sourceFileGlobs.excludes.map(_ => _.absolute);
                const destination = projectSources.outputFiles.root!;

                const taskFunction: TaskFunction = done => {
                    const tsResult = gulp.src(sourceFiles.concat(excludedSourceFiles.map(_ => '!' + _)))
                        .pipe(gulpSourcemaps.init())
                        .pipe(tsProject());
                    tsResult.dts
                        .pipe(gulp.dest(destination));
                    return tsResult.js
                        .pipe(gulpSourcemaps.write())
                        .pipe(gulp.dest(destination))
                        .on('end', _ => done())
                        .on('error', err => done(err));
                };
                taskFunction.displayName = `build${lint ? '' : '-no-lint'}:${this._context.project.rootPackage.packageObject.name}`;
                taskSeries.push(taskFunction);
            }
        taskSeries.push(this.createCopyStaticTask());
        task = gulp.series(...taskSeries);
        task.displayName = `build${lint ? '' : '-no-lint'}`;
        return task;
    }

    private createWorkspacesBuildTask(lint: boolean) {
        const tasks: TaskFunction[] = [];
        const streams: {stream: Readable, dest: string}[] = [];

        this._context.project.workspaces.forEach(workspace => {
            const projectSources = workspace.sources;
            const tsProject = gulpTypescript.createProject(projectSources.tsConfig!);
            const sourceFiles = projectSources.sourceFiles.sourceFileGlobs.includes.map(_ => _.absolute);
            const excludedSourceFiles = projectSources.sourceFiles.sourceFileGlobs.excludes.map(_ => _.absolute);

            const destination = projectSources.outputFiles.root!;
            const taskFunction: TaskFunction = done => {
                const tsResult = gulp.src(sourceFiles.concat(excludedSourceFiles.map(_ => '!' + _)))
                    .pipe(gulpSourcemaps.init())
                    .pipe(tsProject());

                streams.push({stream: tsResult.js, dest: destination});
                streams.push({stream: tsResult.dts, dest: destination});
                tsResult
                    .on('end', _ => done())
                    .on('error', err => done(err));
                return tsResult;
            };
            taskFunction.displayName = `build${lint ? '' : '-no-lint'}:${workspace.workspacePackage.packageObject.name}`;
            tasks.push(taskFunction);
        });
        const writeFilesTask: TaskFunction = done => {
            let counter = 0;
            for (const _ of streams) {
                const stream = _.stream
                    .pipe(gulp.dest(_.dest))
                    .on('end', _ => {
                        counter += 1;
                        if (counter === streams.length) done();
                    })
                    .on('error', err => done(err));
            }
        };
        writeFilesTask.displayName = 'build-write-files';
        const parallelBuild = gulp.parallel(tasks);
        parallelBuild.displayName = 'build-parallel';
        const task = gulp.series(parallelBuild, writeFilesTask);

        return task;
    }

    private createCopyStaticTask() {
        if (this._copyStaticTask === undefined) {
            this._copyStaticTask = createTask(this._context, 'copy', true,  workspace => {
                const usesWebPack = workspace ? workspace.workspacePackage.usesWebpack() : this._context.project.rootPackage.usesWebpack();
                if (usesWebPack) return done => done();
                const projectSources = workspace !== undefined ? workspace.sources : this._context.project.sources;
                const staticFiles = projectSources.sourceFiles.staticSourceFileGlobs.includes.map(_ => _.absolute);
                const excludedStaticFiles = projectSources.sourceFiles.staticSourceFileGlobs.excludes.map(_ => _.absolute);
                const destination = projectSources.outputFiles.root!;
                return done => gulp.src(staticFiles.concat(excludedStaticFiles.map(_ => '!' + _)))
                                    .pipe(gulp.dest(destination))
                                    .on('end', done);
            });
        }

        return this._copyStaticTask;
    }
}

export function getBuildTasks(context: GulpContext) {
    if (BuildTasks.buildTasks === undefined) BuildTasks.buildTasks = new BuildTasks(context);
    return BuildTasks.buildTasks;
}
