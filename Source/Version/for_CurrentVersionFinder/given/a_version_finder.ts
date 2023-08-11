// Copyright (c) woksin-org. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { SemVer } from 'semver';
import * as sinon from 'ts-sinon';
import { NullLogger } from '@woksin/github-actions.shared.logging';
import { IVersionSorter } from '../../IVersionSorter';
import { CurrentVersionFinder } from '../../CurrentVersionFinder';
import { IVersionFetcher } from '../../IVersionFetcher';

export class a_version_finder {
    static with_sorted_versions(...versions: string[]): CurrentVersionFinder {
        const semvers = versions.map(_ => new SemVer(_));

        const fetcher = sinon.stubInterface<IVersionFetcher>({
            fetchPreviouslyReleasedVersions: semvers,
        });

        const sorter = sinon.stubInterface<IVersionSorter>({
            sort: semvers,
        });

        return new CurrentVersionFinder(fetcher, sorter, new NullLogger());
    }
}
