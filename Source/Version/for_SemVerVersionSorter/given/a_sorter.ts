// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { NullLogger } from '@dolittle/github-actions.shared.logging';
import { SemVerVersionSorter } from '../../SemVerVersionSorter';
import { IVersionSorter } from '../../IVersionSorter';

export class a_sorter {
    sorter: IVersionSorter;
    constructor() {
        this.sorter = new SemVerVersionSorter(new NullLogger());
    }
}
