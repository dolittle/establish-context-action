// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { expect } from 'chai';
import { an_extractor } from './given/an_extractor';

describe('when extracting from string with multiple release types', () => {
    const extractor = new an_extractor().extractor;
    const labels = ['major','minor'];

    const release_type = extractor.extract(labels);

    it('should return a release type', () => expect(release_type).to.not.be.undefined);
    it('should return major', () => release_type!.should.equal('major'));
});
