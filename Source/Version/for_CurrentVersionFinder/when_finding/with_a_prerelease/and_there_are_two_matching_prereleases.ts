// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { SemVer } from 'semver';
import { a_version_finder } from '../../given/a_version_finder';

describe('when finding with a prerelease and there are two matching prereleases', () => {
    const finder = a_version_finder.with_sorted_versions('1.2.0', '1.2.0-alpha', '1.1.0-alpha.1', '1.1.0-alpha', '1.0.0', '0.9.0');
    const prerelease = new SemVer('1.1.0-alpha');

    const result = finder.find(prerelease).then(_ => _.format());

    it('should return the specified prerelease', () => result.should.eventually.equal('1.1.0-alpha.1'));
});
