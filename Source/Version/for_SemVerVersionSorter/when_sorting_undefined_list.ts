// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { a_sorter } from './given/a_sorter';

import { describeThis } from '@dolittle/typescript.testing';

describeThis(__filename, () => {
    const version_sorter = new a_sorter().sorter;
    const res = version_sorter.sort(undefined as any);

    it('should return an empty list', () => res.should.be.empty);
});
