// Copyright (c) woksin-org. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { NullLogger } from '@woksin/github-actions.shared.logging';
import { ReleaseTypeExtractor } from '../../ReleaseTypeExtractor';
import { IReleaseTypeExtractor } from '../../IReleaseTypeExtractor';

export class an_extractor {
    extractor: IReleaseTypeExtractor;

    constructor() {
        this.extractor = new ReleaseTypeExtractor(new NullLogger());
    }

}
