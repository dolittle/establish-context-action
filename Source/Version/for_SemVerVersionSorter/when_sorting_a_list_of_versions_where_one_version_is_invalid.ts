// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { expect } from 'chai';
import { a_sorter } from './given/a_sorter';
import { SemVer } from 'semver';

describe('when sorting a list of versions where one version is invalid', () => {
    const version_sorter = new a_sorter().sorter;

    const valid_version = new SemVer('2.0.0');
    const invalid_version = 'something1.1.0';
    let exception: Error;
    try {
        version_sorter.sort([valid_version, invalid_version as any as SemVer]);
    }
    catch (error) {
        exception = error;
    }

    it('should throw an exception', () => expect(exception).to.not.undefined);
});
