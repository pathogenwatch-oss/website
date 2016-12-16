import React from 'react';

import { FETCH_ENTITIES } from '../actions/fetch';
import { SET_COLOUR_COLUMNS, SHOW_TABLE_VIEW } from '../collection-viewer/table/actions';

import Species from '../species';
import * as resistanceProfile from '../utils/resistanceProfile';
import { measureText } from '../table/utils/columnWidth';

import * as constants from '../collection-viewer/table/constants';

const systemColumnProps = [
  constants.downloadColumnProps,
  { ...constants.nameColumnProps,
    flexGrow: 0,
    headerClasses: 'wgsa-table-header--unstyled',
    onHeaderClick: () => {},
  },
];

const isMac =
  (navigator && navigator.platform &&
    navigator.platform.toUpperCase().indexOf('MAC') >= 0);
const modifierKey = isMac ? 'Cmd' : 'Ctrl';

function createAntibioticsColumn({ key, fullName }) {
  const columnKey = key;
  const hoverName = fullName || key;

  return {
    columnKey,
    isExpandable() {
      return this.isSelected && this.allMechanisms.length;
    },
    getLabel() {
      // return this.isExpandable() ? hoverName : key.slice(0, 3);
      return key.slice(0, 3);
    },
    headerClasses: 'wgsa-table-header--resistance',
    headerTitle: `${hoverName} - ${modifierKey} + click to select multiple`,
    cellClasses: 'wgsa-table-cell--resistance',
    flexGrow: 0,
    getWidth() {
      return 32;
    },
    cellPadding: 16,
    getCellContents(props, { analysis }) {
      const { antibiotics } = analysis.resistanceProfile;
      const isResistant =
        resistanceProfile.isResistant(analysis.resistanceProfile, props.columnKey);
      if (isResistant) {
        const { state } = antibiotics[props.columnKey];
        return (
          <i
            className={`material-icons wgsa-resistance-icon wgsa-amr--${state.toLowerCase()}`}
          >
            lens
          </i>
        );
      }
      return null;
    },
    valueGetter: assembly => resistanceProfile.getColour(key, assembly),
    onHeaderClick: resistanceProfile.onHeaderClick,
  };
}

function createAdvancedViewColumn({ key, label }, profileKey) {
  return {
    addState({ data }) {
      this.hidden = data.every(
        ({ analysis }) =>
          analysis.resistanceProfile[profileKey].indexOf(key) === -1
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
    valueGetter: assembly =>
      resistanceProfile.getAdvancedColour(key, profileKey, assembly),
    onHeaderClick: resistanceProfile.onHeaderClick,
  };
}

const viewColumnBuilders = {
  Antibiotics: ({ antibiotics }) => {
    const separatorIndex = Species.current.resistanceProfileSeparatorIndex;

    if (typeof separatorIndex === 'undefined') {
      return antibiotics.map(createAntibioticsColumn);
    }

    return [
      ...antibiotics.slice(0, separatorIndex).map(createAntibioticsColumn),
      { columnKey: '__group_spacer',
        getHeaderContent() {},
        fixedWidth: 40,
        flexGrow: 0,
        getCellContents() {},
        cellClasses: 'wgsa-table-cell--resistance',
      },
      ...antibiotics.slice(separatorIndex).map(createAntibioticsColumn),
    ];
  },
  SNPs: ({ snp, antibiotics }) =>
    Object.keys(snp).
      map(antibiotic => ({
        group: true,
        columnKey: `snp_${antibiotic}`,
        columns:
          Object.keys(snp[antibiotic]).
            reduce((columns, gene) =>
              columns.concat({
                cellClasses: 'wgsa-table-cell--resistance',
                columnKey: gene,
                fixedWidth: measureText(gene, true) + 16,
                flexGrow: 0,
                getCellContents() {},
                getHeaderContent: () => `${gene}_`,
                addState({ data }) {
                  this.hidden =
                    snp[antibiotic][gene].every(snpName =>
                      data.every(
                        ({ analysis }) =>
                          analysis.resistanceProfile.snp.indexOf(`${gene}_${snpName}`) === -1
                      )
                    );
                  return this;
                },
                headerClasses: 'wgsa-table-header',
              },
              snp[antibiotic][gene].
                map(snpName => createAdvancedViewColumn(
                  { key: `${gene}_${snpName}`, label: snpName }, 'snp'
                ))
              ), []),
        getLabel: () => antibiotic,
        headerClasses: 'wgsa-table-header--group',
        headerTitle: antibiotics.find(_ => _.key === antibiotic).fullName,
        onHeaderClick: resistanceProfile.onHeaderClick,
      })),
  Genes: ({ paar, antibiotics }) =>
    Object.keys(paar).
      map(antibiotic => ({
        group: true,
        columnKey: `paar_${antibiotic}`,
        columns: paar[antibiotic].
          map(element => createAdvancedViewColumn(
            { key: element, label: element }, 'paar'
          )),
        getLabel: () => antibiotic,
        headerClasses: 'wgsa-table-header--group',
        headerTitle: antibiotics.find(_ => _.key === antibiotic).fullName,
        onHeaderClick: resistanceProfile.onHeaderClick,
      })),
};

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

function buildColumns(view, libraries) {
  const columns = viewColumnBuilders[view](libraries);

  return [ systemGroup ].concat(
    columns.some(_ => _.group) ?
      columns :
      { group: true,
        columnKey: 'test2',
        getHeaderContent() {},
        columns,
      },
    spacerGroup
  );
}

const initialState = {
  activeColumns: new Set(),
  columns: [],
  view: constants.views[constants.tableKeys.resistanceProfile][0],
  libraries: {},
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_ENTITIES.SUCCESS: {
      const libraries = payload.result[2];
      return {
        ...state,
        libraries,
        columns: buildColumns(state.view, libraries),
      };
    }
    case SET_COLOUR_COLUMNS:
      return {
        ...state,
        activeColumns: payload.columns,
      };
    case SHOW_TABLE_VIEW:
      if (state.view === payload.view) return state;
      return {
        ...state,
        view: payload.view,
        columns: buildColumns(payload.view, state.libraries),
      };
    default:
      return state;
  }
}
