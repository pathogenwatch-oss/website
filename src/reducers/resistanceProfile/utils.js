import React from 'react';

import { FETCH_ENTITIES } from '../../actions/fetch';
import { SET_COLOUR_COLUMNS } from '../../collection-viewer/table/actions';

import * as resistanceProfile from '../../utils/resistanceProfile';
import { measureText } from '../../table/utils/columnWidth';

import * as constants from '../../collection-viewer/table/constants';
import Species from '../../species';

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

export function createAdvancedViewColumn({ key, label }, profileKey, profiles) {
  return {
    addState({ data }) {
      this.hidden = data.every(({ analysis }) =>
        notPresent(analysis.resistanceProfile[profileKey], key)
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
      return analysis.resistanceProfile[profileKey].indexOf(key) !== -1 ? (
        <i className="material-icons wgsa-resistance-icon wgsa-amr--resistant">
          lens
        </i>
      ) : null;
    },
    headerClasses: 'wgsa-table-header--expanded',
    hidden: profiles.every(profile => notPresent(profile[profileKey], key)),
    valueGetter: assembly =>
      resistanceProfile.getAdvancedColour(key, profileKey, assembly),
    onHeaderClick: resistanceProfile.onHeaderClick,
  };
}

function getResistanceProfiles(assemblies) {
  return Object.keys(assemblies).
    reduce((profiles, id) => {
      const { analysis } = assemblies[id];
      if (!analysis.resistanceProfile) return profiles;
      profiles.push(analysis.resistanceProfile);
      return profiles;
    }, []);
}

const initialState = {
  activeColumns: new Set(),
  columns: [],
};

export function createReducer({ name, buildColumns }) {
  return function (state = initialState, { type, payload }) {
    switch (type) {
      case FETCH_ENTITIES.SUCCESS: {
        const [ collection, , libraries ] = payload.result;
        const resistanceProfiles = getResistanceProfiles(collection.assemblies);
        const columns = buildColumns(libraries, resistanceProfiles);
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

export function checkCustomLabels(key) {
  const { customLabels = {} } = Species.current.amrOptions || {};
  return (key in customLabels ? customLabels[key] : key.slice(0, 3));
}
