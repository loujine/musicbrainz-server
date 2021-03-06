/*
 * @flow strict-local
 * Copyright (C) 2018 MetaBrainz Foundation
 *
 * This file is part of MusicBrainz, the open internet music database,
 * and is licensed under the GPL version 2, or (at your option) any
 * later version: http://www.gnu.org/licenses/gpl-2.0.txt
 */

import * as React from 'react';

import EditorLink from '../../static/scripts/common/components/EditorLink';
import formatUserDate from '../../utility/formatUserDate';
import {votesVisible} from '../../utility/voting';

type RowProps = {
  +$c: CatalystContextT,
  +election: AutoEditorElectionT,
  +index: number,
};

const ElectionTableRow = ({
  $c,
  election,
  index,
}: RowProps): React.Element<'tr'> => (
  <tr className={index % 2 ? 'even' : 'odd'}>
    <td><EditorLink editor={election.candidate} /></td>
    <td>
      {lp(election.status_name_short, 'autoeditor election status (short)')}
    </td>
    <td>{formatUserDate($c, election.propose_time)}</td>
    <td>
      {nonEmpty(election.close_time)
        ? formatUserDate($c, election.close_time)
        : '-'}
    </td>
    <td><EditorLink editor={election.proposer} /></td>
    <td>
      {election.seconder_1
        ? <EditorLink editor={election.seconder_1} />
        : '-'}
    </td>
    <td>
      {election.seconder_2
        ? <EditorLink editor={election.seconder_2} />
        : '-'}
    </td>
    <td>
      {votesVisible(election, $c.user)
        ? election.yes_votes
        : '-'}
    </td>
    <td>
      {votesVisible(election, $c.user)
        ? election.no_votes
        : '-'}
    </td>
    <td><a href={`/election/${election.id}`}>{l('View details')}</a></td>
  </tr>
);

type Props = {
  +$c: CatalystContextT,
  +elections: $ReadOnlyArray<AutoEditorElectionT>,
};

const ElectionTableRows = ({
  $c,
  elections,
}: Props): $ReadOnlyArray<React.Element<typeof ElectionTableRow>> => (
  elections.map((election, index) => (
    <ElectionTableRow
      $c={$c}
      election={election}
      index={index}
      key={election.id}
    />
  ))
);

export default ElectionTableRows;
