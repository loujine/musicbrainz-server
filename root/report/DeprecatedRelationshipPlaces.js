/*
 * @flow strict-local
 * Copyright (C) 2018 MetaBrainz Foundation
 *
 * This file is part of MusicBrainz, the open internet music database,
 * and is licensed under the GPL version 2, or (at your option) any
 * later version: http://www.gnu.org/licenses/gpl-2.0.txt
 */

import * as React from 'react';

import PlaceRelationshipList from './components/PlaceRelationshipList';
import ReportLayout from './components/ReportLayout';
import type {ReportDataT, ReportPlaceRelationshipT} from './types';

const DeprecatedRelationshipPlaces = ({
  canBeFiltered,
  filtered,
  generated,
  items,
  pager,
}: ReportDataT<ReportPlaceRelationshipT>):
React.Element<typeof ReportLayout> => (
  <ReportLayout
    canBeFiltered={canBeFiltered}
    description={l(
      `This report lists places which have relationships using
       deprecated and grouping-only relationship types.`,
    )}
    entityType="place"
    filtered={filtered}
    generated={generated}
    title={l('Places with deprecated relationships')}
    totalEntries={pager.total_entries}
  >
    <PlaceRelationshipList items={items} pager={pager} />
  </ReportLayout>
);

export default DeprecatedRelationshipPlaces;
