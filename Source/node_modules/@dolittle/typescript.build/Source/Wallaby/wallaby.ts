/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import fs from 'fs';
import path from 'path';
import { WallabySettingsCallback, SetupCallback, WallabySettings, WallabySetup, Project, SourceFiles } from '../internal';

export function wallaby(settingsCallback?: WallabySettingsCallback, setupCallback?: SetupCallback) {
    return (wallaby: any) => {
        const project = new Project(process.cwd());
        const setup = new WallabySetup(wallaby, project, setupCallback);
        const settings = new WallabySettings(wallaby, project, setup, settingsCallback);

        setNodePath(wallaby, project);

        if (typeof settingsCallback === 'function') settingsCallback(wallaby, settings);
        return settings.settings;
    };
}

function setNodePath(w: any, project: Project) {
    let nodePath: string = w.projectCacheDir;
    const sourcePath = path.join(project.sources.root, SourceFiles.FOLDER_NAME);
    if (project.workspaces.length > 1 && fs.existsSync(sourcePath)) {
        nodePath = path.join(nodePath, SourceFiles.FOLDER_NAME);
    }

    process.env.NODE_PATH = nodePath;
}
