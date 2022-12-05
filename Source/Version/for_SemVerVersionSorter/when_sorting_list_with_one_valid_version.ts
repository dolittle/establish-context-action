// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { a_sorter } from './given/a_sorter';
import { SemVer } from 'semver';

import { describeThis } from '@dolittle/typescript.testing';

describeThis(__filename, () => {
    const version_sorter = new a_sorter().sorter;
    const version = new SemVer('1.0.0');
    const res = version_sorter.sort([version]);

    it('should return a list with 1 element', () => res.should.have.lengthOf(1));
    it('should return a list with the version', () => res.should.include(version));
});
