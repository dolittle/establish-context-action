// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { SemVer } from 'semver';
import { a_version_finder } from '../../given/a_version_finder';

import { describeThis } from '@dolittle/typescript.testing';

describeThis(__filename, () => {
    const finder = a_version_finder.with_sorted_versions('1.3.0-beta.1', '1.2.0-beta.2', '1.2.0-beta.1', '1.2.0-beta', '1.1.0');
    const prerelease = new SemVer('1.3.0-beta');

    const result = finder.find(prerelease).then(_ => _.format());

    it('should return the specified prerelease', () => result.should.eventually.equal('1.3.0-beta.1'));
});
