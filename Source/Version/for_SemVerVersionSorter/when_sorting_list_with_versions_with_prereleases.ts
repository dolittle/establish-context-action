// Copyright (c) woksin-org. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { SemVer } from 'semver';
import { a_sorter } from './given/a_sorter';

import { describeThis } from '@woksin/typescript.testing';

describeThis(__filename, () => {
    const version_sorter = new a_sorter().sorter;
    const version1 = new SemVer('2.0.0-preview.2');
    const version2 = new SemVer('2.0.0-preview.1');
    const version3 = new SemVer('2.0.0-beta.2');
    const version4 = new SemVer('2.0.0-beta.1');
    const version5 = new SemVer('2.0.0-alpha.2');
    const version6 = new SemVer('2.0.0-alpha.1');
    const res = version_sorter.sort([version2, version3, version1, version5, version4, version6], true);

    it('should return a list with three elements', () => res.should.have.lengthOf(6));
    it('should return biggest version as the first element ', () => res[0].should.equal(version1));
    it('should return second biggest version as the second element', () => res[1].should.equal(version2));
    it('should return third biggest version as the third element', () => res[2].should.equal(version3));
    it('should return biggest version as the first element ', () => res[3].should.equal(version4));
    it('should return second biggest version as the second element', () => res[4].should.equal(version5));
    it('should return third biggest version as the third element', () => res[5].should.equal(version6));
});
