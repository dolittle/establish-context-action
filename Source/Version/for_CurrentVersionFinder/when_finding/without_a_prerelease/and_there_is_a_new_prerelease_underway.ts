// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { a_version_finder } from '../../given/a_version_finder';

describe('when finding without a prerelease and there is a new prerelease underway', () => {
    const finder = a_version_finder.with_sorted_versions('2.0.0-lightspeed','1.1.0','1.0.1','1.0.0');

    const result = finder.find(undefined).then(_ => _.format());

    it('should return the last non-prerelease', () => result.should.eventually.equal('1.1.0'));
});
