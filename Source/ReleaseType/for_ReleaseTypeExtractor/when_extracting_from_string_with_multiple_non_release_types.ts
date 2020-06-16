// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { expect } from 'chai';
import { an_extractor } from './given/an_extractor';

describe('when extracting from string with multiple non release types', () => {
    const extractor = new an_extractor().extractor;
    const labels = ['something','somethingElse'];
    const result = extractor.extract(labels);

    it('should return undefined', () => expect(result).to.be.undefined);
});
