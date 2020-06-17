// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { a_sorter } from './given/a_sorter';
import { SemVer } from 'semver';

describe('when sorting list with three unordered versions with and without v in front', () => {
    const version_sorter = new a_sorter().sorter;
    const version1 = new SemVer('v2.0.0');
    const version2 = new SemVer('1.1.0');
    const version3 = new SemVer('v1.0.0');
    const res = version_sorter.sort([version2, version3, version1]);

    it('should return a list with three elements', () => res.should.have.lengthOf(3));
    it('should return biggest version as the first element ', () => res[0].should.equal(version1));
    it('should return second biggest version as the second element', () => res[1].should.equal(version2));
    it('should return third biggest version as the third element', () => res[2].should.equal(version3));
});
