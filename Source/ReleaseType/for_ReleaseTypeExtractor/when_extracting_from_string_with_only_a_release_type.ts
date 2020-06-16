// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { an_extractor } from './given/an_extractor';

describe('when extracting from string with only a release type', () => {
    const extractor = new an_extractor().extractor;
    const labels = ['major'];
    const result = extractor.extract(labels);

    it('should return major', () => result!.should.be.equal('major'));
});
