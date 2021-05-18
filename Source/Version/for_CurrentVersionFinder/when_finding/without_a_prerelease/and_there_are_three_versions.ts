// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { a_version_finder } from '../../given/a_version_finder';

describe('when finding without a prerelease there are three versions', () => {
    const finder = a_version_finder.with_sorted_versions('1.0.0', '0.9.1', '0.0.0');

    const result = finder.find(undefined).then(_ => _.format());

    it('should return the last version', () => result.should.eventually.equal('1.0.0'));
});
