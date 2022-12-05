// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { a_sorter } from './given/a_sorter';
import { describeThis } from '@dolittle/typescript.testing';
import { SemVer } from 'semver';

describeThis(__filename, () => {
    const version_sorter = new a_sorter().sorter;
    const version1 = new SemVer('2.0.0');
    const version2 = new SemVer('1.1.0');
    const version3 = new SemVer('1.0.0');
    const res = version_sorter.sort([version2, version3, version1]);

    it('should return a list with three elements', () => res.should.have.lengthOf(3));
    it('should return biggest version as the first element ', () => res[0].should.equal(version1));
    it('should return second biggest version as the second element', () => res[1].should.equal(version2));
    it('should return third biggest version as the third element', () => res[2].should.equal(version3));
});
