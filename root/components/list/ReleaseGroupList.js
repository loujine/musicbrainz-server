/*
 * @flow strict-local
 * Copyright (C) 2019 MetaBrainz Foundation
 *
 * This file is part of MusicBrainz, the open internet music database,
 * and is licensed under the GPL version 2, or (at your option) any
 * later version: http://www.gnu.org/licenses/gpl-2.0.txt
 */

import * as React from 'react';
import Slider from 'react-slick';

import {CatalystContext} from '../../context';
import Table from '../Table';
import releaseGroupType from '../../utility/releaseGroupType';
import {groupBy} from '../../static/scripts/common/utility/arrays';
import parseDate from '../../static/scripts/common/utility/parseDate';
import {
  defineArtistCreditColumn,
  defineCheckboxColumn,
  defineNameColumn,
  defineSeriesNumberColumn,
  defineTextColumn,
  defineCountColumn,
  ratingsColumn,
  removeFromMergeColumn,
} from '../../utility/tableColumns';

type ReleaseGroupListTableProps = {
  ...SeriesItemNumbersRoleT,
  +checkboxes?: string,
  +mergeForm?: MergeFormT,
  +order?: string,
  +releaseGroups: $ReadOnlyArray<ReleaseGroupT>,
  +showRatings?: boolean,
  +showType?: boolean,
  +sortable?: boolean,
};

type ReleaseGroupListProps = {
  ...SeriesItemNumbersRoleT,
  +checkboxes?: string,
  +mergeForm?: MergeFormT,
  +order?: string,
  +releaseGroups: $ReadOnlyArray<ReleaseGroupT>,
  +showRatings?: boolean,
  +sortable?: boolean,
};

const ReleaseGroupListCarousel = ({
  releaseGroups,
}) => {
  const settings = {
    arrows: true,
    centerMode: false,
    dots: false,
    infinite: true,
    lazyLoad: false,
    slidesToScroll: 3,
    slidesToShow: 4,
    speed: 500,
  };

  function getFirstReleaseYear(entity: ReleaseGroupT) {
    if (!nonEmpty(entity.firstReleaseDate)) {
      return '—';
    }

    return parseDate(entity.firstReleaseDate).year?.toString() ?? '—';
  }
  function slickSlide(entity) {
    const coverUrl = `https://coverartarchive.org/release-group/${entity.gid}/front-250.jpg`;
    const rgUrl = `https://musicbrainz.org/release-group/${entity.gid}`;
    return (
      <div>
        <a href={rgUrl}>
          <img src={coverUrl} />
        </a>
        <p>{getFirstReleaseYear(entity)}</p>
      </div>
    );
  }
  return (
    <div className="slick-container">
      <Slider {...settings}>
        {releaseGroups.map(
          group => slickSlide(group),
        )}
      </Slider>
    </div>
  );
};

export const ReleaseGroupListTable = ({
  checkboxes,
  mergeForm,
  order,
  releaseGroups,
  seriesItemNumbers,
  showRatings = false,
  showType = true,
  sortable,
}: ReleaseGroupListTableProps): React.Element<typeof Table> => {
  const $c = React.useContext(CatalystContext);

  function getFirstReleaseYear(entity: ReleaseGroupT) {
    if (!nonEmpty(entity.firstReleaseDate)) {
      return '—';
    }

    return parseDate(entity.firstReleaseDate).year?.toString() ?? '—';
  }

  const columns = React.useMemo(
    () => {
      const checkboxColumn = $c.user && (nonEmpty(checkboxes) || mergeForm)
        ? defineCheckboxColumn({mergeForm: mergeForm, name: checkboxes})
        : null;
      const seriesNumberColumn = seriesItemNumbers
        ? defineSeriesNumberColumn({seriesItemNumbers: seriesItemNumbers})
        : null;
      const yearColumn = defineTextColumn<ReleaseGroupT>({
        cellProps: {className: 'c'},
        columnName: 'year',
        getText: entity => getFirstReleaseYear(entity),
        headerProps: {className: 'year c'},
        order: order,
        sortable: sortable,
        title: l('Year'),
      });
      const nameColumn = defineNameColumn<ReleaseGroupT>({
        descriptive: false, // since ACs are in the next column
        order: order,
        sortable: sortable,
        title: l('Title'),
      });
      const artistCreditColumn = defineArtistCreditColumn<ReleaseGroupT>({
        columnName: 'artist',
        getArtistCredit: entity => entity.artistCredit,
        title: l('Artist'),
      });
      const typeColumn = defineTextColumn<ReleaseGroupT>({
        columnName: 'primary-type',
        getText: entity => entity.l_type_name || '',
        order: order,
        sortable: sortable,
        title: l('Type'),
      });
      const releaseNumberColumn = defineCountColumn<ReleaseGroupT>({
        columnName: 'release_count',
        getCount: entity => entity.release_count,
        title: l('Releases'),
      });

      return [
        ...(checkboxColumn ? [checkboxColumn] : []),
        ...(seriesNumberColumn ? [seriesNumberColumn] : []),
        yearColumn,
        nameColumn,
        artistCreditColumn,
        ...(showType ? [typeColumn] : []),
        ...(showRatings ? [ratingsColumn] : []),
        releaseNumberColumn,
        ...(mergeForm && releaseGroups.length > 2
          ? [removeFromMergeColumn]
          : []),
      ];
    },
    [
      $c.user,
      checkboxes,
      mergeForm,
      order,
      releaseGroups,
      seriesItemNumbers,
      showRatings,
      showType,
      sortable,
    ],
  );

  return (
    <Table
      className="release-group-list"
      columns={columns}
      data={releaseGroups}
    />
  );
};

const ReleaseGroupList = ({
  checkboxes,
  mergeForm,
  order,
  releaseGroups,
  seriesItemNumbers,
  showRatings,
  sortable,
}: ReleaseGroupListProps): Array<React$Node> => {
  const groupedReleaseGroups = groupBy(releaseGroups, x => x.typeName ?? '');
  return (
    Object.keys(groupedReleaseGroups).map<React$Node>((type) => {
      const releaseGroupsOfType = groupedReleaseGroups[type];
      return (
        <React.Fragment key={type}>
          <h3>
            {type === ''
              ? l('Unspecified type')
              : releaseGroupType(releaseGroupsOfType[0])
            }
          </h3>
          {releaseGroupsOfType.length > 1 ?
            <ReleaseGroupListCarousel
              releaseGroups={releaseGroupsOfType}
            /> : null
          }
          <ReleaseGroupListTable
            checkboxes={checkboxes}
            mergeForm={mergeForm}
            order={order}
            releaseGroups={releaseGroupsOfType}
            seriesItemNumbers={seriesItemNumbers}
            showRatings={showRatings}
            showType={false}
            sortable={sortable}
          />
        </React.Fragment>
      );
    })
  );
};

export default ReleaseGroupList;
