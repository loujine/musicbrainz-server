/*
 * @flow strict-local
 * Copyright (C) 2019 MetaBrainz Foundation
 *
 * This file is part of MusicBrainz, the open internet music database,
 * and is licensed under the GPL version 2, or (at your option) any
 * later version: http://www.gnu.org/licenses/gpl-2.0.txt
 */

import * as React from 'react';

import EventList from '../components/list/EventList';
import PaginatedResults from '../components/PaginatedResults';
import {returnToCurrentPage} from '../utility/returnUri';

import ArtistLayout from './ArtistLayout';

type Props = {
  +$c: CatalystContextT,
  +artist: ArtistT,
  +events: $ReadOnlyArray<EventT>,
  +pager: PagerT,
};

const ArtistEvents = ({
  $c,
  artist,
  events,
  pager,
}: Props): React.Element<typeof ArtistLayout> => (
  <ArtistLayout $c={$c} entity={artist} page="events" title={l('Events')}>
    <h2>{l('Events')}</h2>

    {events.length > 0 ? (
      <form
        action={'/event/merge_queue?' + returnToCurrentPage($c)}
        method="post"
      >
        <PaginatedResults pager={pager}>
          <EventList
            artist={artist}
            artistRoles
            checkboxes="add-to-merge"
            events={events}
            showLocation
            showRatings
            showType
          />
        </PaginatedResults>
        {$c.user ? (
          <div className="row">
            <span className="buttons">
              <button type="submit">
                {l('Add selected events for merging')}
              </button>
            </span>
          </div>
        ) : null}
      </form>
    ) : (
      <p>
        {l('This artist is not currently associated with any events.')}
      </p>
    )}
  </ArtistLayout>
);

export default ArtistEvents;
