// Copyright (c) woksin-org. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { SemVer } from 'semver';
import { a_version_finder } from '../../given/a_version_finder';

import { describeThis } from '@woksin/typescript.testing';

describeThis(__filename, () => {
    const finder = a_version_finder.with_sorted_versions();
    const prerelease = new SemVer('1.1.0-alpha');

    const result = finder.find(prerelease).then(_ => _.format());

    it('should return the specified prerelease', () => result.should.eventually.equal('1.1.0-alpha'));
});
