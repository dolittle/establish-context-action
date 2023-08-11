// Copyright (c) woksin-org. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { expect } from 'chai';
import { an_extractor } from './given/an_extractor';

import { describeThis } from '@woksin/typescript.testing';

describeThis(__filename, () => {
    const extractor = new an_extractor().extractor;
    const result = extractor.extract(undefined as any);

    it('should return undefined', () => expect(result).to.be.undefined);
});
