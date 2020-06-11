/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { Project } from '../../internal';

export type SetupCallback = (w: any) => void;


export class WallabySetup {

    private _setup!: (wallaby: any) => void;

    constructor(private _w: any, private _project: Project, private _setupCallback?: SetupCallback) {}

    get setup() {
        if (this._setup === undefined) this._setup = this.getSetupFunction();
        return this._setup;
    }

    private getFunctionBody(func: Function) {
        const entire = func.toString();
        const body = entire.substring(entire.indexOf('{') + 1, entire.lastIndexOf('}'));
        return body;
      }

    private getSetupFunction(): (wallaby: any) => void {
        const setup = (wallaby: any) => {
            (process.env as any).IS_TESTING = true;
            const Project = require('@dolittle/typescript.build').Project;
            const project = new Project(process.cwd());

            if (project.workspaces.length > 0) {
                const aliases: any = {};
                project.workspaces.forEach((workspace: any) => {
                    const packageObject = workspace.workspacePackage.packageObject;
                    const rootFolder = workspace.workspacePackage.rootFolder;
                    aliases[packageObject.name] = rootFolder;
                });
                require('module-alias').addAliases(aliases);
            }

            (global as any).expect = chai.expect;
            const should = chai.should();
            (global as any).sinon = require('sinon');
            const sinonChai = require('sinon-chai');
            const chaiAsPromised = require('chai-as-promised');
            chai.use(sinonChai);
            chai.use(chaiAsPromised);

            (global as any).mock = require('@fluffy-spoon/substitute').Substitute;
        };

        if (typeof this._setupCallback === 'function') {
            const setupBody = this.getFunctionBody(setup);
            const setupCallbackBody = this.getFunctionBody(this._setupCallback);
            const combined = setupBody + '\n' + setupCallbackBody;
            const newFunction = new Function(combined);
            return newFunction as (wallaby: any) => void;
        }

        return setup;
    }
}
