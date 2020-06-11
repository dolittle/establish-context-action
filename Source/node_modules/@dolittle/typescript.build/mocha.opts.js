/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
let chai = require('chai');
global.expect = chai.expect;
let should = chai.should();
global.sinon = require('sinon');
let sinonChai = require('sinon-chai');
let chaiAsPromised = require('chai-as-promised');
chai.use(sinonChai);
chai.use(chaiAsPromised);
let jsdom = require('jsdom-global')(undefined, {url: 'http://localhost/'})