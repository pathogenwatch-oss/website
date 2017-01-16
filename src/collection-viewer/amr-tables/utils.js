import React from 'react';

import { FETCH_COLLECTION } from '../../collection-route/actions';
import { SET_COLOUR_COLUMNS } from '../table/actions';
import { onHeaderClick } from './thunks';

import * as amr from '../amr-utils';
import { measureText } from '../table/utils/columnWidth';
import * as constants from '../table/constants';
import { statuses } from '../../collection-route/constants';

const systemColumnProps = [
  constants.downloadColumnProps,
  { ...constants.nameColumnProps,
    flexGrow: 0,
    headerClasses: 'wgsa-table-header--unstyled',
    onHeaderClick: () => {},
  },
];

const systemGroup = {
  group: true,
  system: true,
  fixed: true,
  columnKey: 'system',
  getHeaderContent() {},
  columns: [
    { columnKey: '__spacer_l',
      getHeaderContent() {},
      fixed: true,
      fixedWidth: 1,
      getCellContents() {},
    },
    ...systemColumnProps,
  ],
};

const spacerGroup = {
  group: true,
  system: true,
  columnKey: 'spacer',
  getHeaderContent() {},
  columns: [
    { columnKey: '__spacer_r',
      getHeaderContent() {},
      fixedWidth: 8,
      getCellContents() {},
      cellClasses: 'wgsa-table-cell--resistance',
    },
  ],
};

function notPresent(profileSection, element) {
  return profileSection.indexOf(element) === -1;
}

export function createAdvancedViewColumn({ key, label }, profileKey, profiles) {
  return {
    addState({ data }) {
      this.hidden = data.every(({ analysis }) =>
        notPresent(analysis.paarsnp[profileKey], key)
      );
      this.width = this.getWidth() + 16;
      return this;
    },
    columnKey: key,
    cellClasses: 'wgsa-table-cell--resistance',
    cellPadding: 16,
    flexGrow: 0,
    getLabel() {
      return label;
    },
    getWidth() {
      return measureText(label, true) + 4;
    },
    getCellContents(props, { analysis }) {
      return analysis.paarsnp[profileKey].indexOf(key) !== -1 ? (
        <i className="material-icons wgsa-resistance-icon wgsa-amr--resistant">
          lens
        </i>
      ) : null;
    },
    headerClasses: 'wgsa-table-header--expanded',
    hidden: profiles.every(profile => notPresent(profile[profileKey], key)),
    valueGetter: genome =>
      amr.getAdvancedColour(key, profileKey, genome),
    onHeaderClick,
  };
}

function getPaarsnpResults(genomes) {
  return genomes.reduce((results, { analysis }) => {
    if (!analysis.paarsnp) return results;
    results.push(analysis.paarsnp);
    return results;
  }, []);
}

const initialState = {
  activeColumns: new Set(),
  columns: [],
};

export function createReducer({ name, buildColumns }) {
  return function (state = initialState, { type, payload }) {
    switch (type) {
      case FETCH_COLLECTION.SUCCESS: {
        const { genomes, _species, status } = payload.result;
        if (status !== statuses.READY) return state;

        const paarsnpResults = getPaarsnpResults(genomes);
        const columns = buildColumns(_species.resistance, paarsnpResults);
        return {
          ...state,
          columns: [ systemGroup ].concat(
            columns.some(_ => _.group) ?
              columns :
              { group: true,
                columnKey: 'dynamicGroup',
                getHeaderContent() {},
                columns,
              },
            spacerGroup
          ),
        };
      }
      case SET_COLOUR_COLUMNS:
        return {
          ...state,
          activeColumns:
            payload.table === name ?
              payload.columns :
              state.activeColumns,
        };
      default:
        return state;
    }
  };
}
