import React from 'react';

import { FETCH_COLLECTION } from '../../collection-viewer/actions';
import { SET_COLOUR_COLUMNS } from '../table/actions';
import { onHeaderClick } from './thunks';

import * as amr from '../amr-utils';
import { measureText } from '../table/columnWidth';
import * as constants from '../table/constants';
import { statuses } from '../../collection-viewer/constants';

import Organisms from '../../organisms';

const systemGroup = {
  group: true,
  system: true,
  fixed: true,
  columnKey: 'system',
  getHeaderContent() {},
  columns: [
    constants.leftSpacerColumn,
    constants.downloadColumnProps,
    { ...constants.nameColumnProps,
      flexGrow: 0,
      headerClasses: 'wgsa-table-header--unstyled',
      onHeaderClick: () => {},
    },
  ],
};

const spacerGroup = {
  group: true,
  system: true,
  columnKey: 'spacer',
  getHeaderContent() {},
  columns: [
    { ...constants.rightSpacerColumn,
      cellClasses: 'wgsa-table-cell--resistance', // for border on last column
    },
  ],
};

function notPresent(profileSection, element) {
  return profileSection.indexOf(element) === -1;
}

export function createAdvancedViewColumn(element, profileKey, profiles) {
  const { key, displayName, label, effect } = element;
  return {
    addState({ data }) {
      if (!data.length) return this;
      this.hidden = data.every(({ analysis }) =>
        !analysis.paarsnp || notPresent(analysis.paarsnp[profileKey], key)
      );
      this.width = this.getWidth() + 16;
      return this;
    },
    columnKey: key,
    displayName,
    label,
    cellClasses: 'wgsa-table-cell--resistance',
    cellPadding: 16,
    flexGrow: 0,
    getWidth() {
      return measureText(label, true) + 4;
    },
    getCellContents(props, genome) {
      return amr.hasElement(genome, profileKey, key) ? (
        <i
          className="material-icons wgsa-resistance-icon"
          style={{ color: amr.getEffectColour(effect) }}
        >
          lens
        </i>
      ) : null;
    },
    headerClasses: 'wgsa-table-header--expanded',
    hidden: profiles.every(profile => notPresent(profile[profileKey], key)),
    valueGetter: genome =>
      amr.getAdvancedColour(element, profileKey, genome),
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
        const { collection } = payload.result;
        const { genomes, organism, status } = collection;
        if (status !== statuses.READY) return state;

        const paarsnpResults = getPaarsnpResults(genomes);
        const columns = buildColumns(organism.resistance, paarsnpResults);
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

export function getAntibioticLabel({ key, displayName }) {
  if (displayName) return displayName;
  // provide backwards compatibility
  const { customLabels = {} } = Organisms.current.amrOptions || {};
  return customLabels[key] || key;
}
