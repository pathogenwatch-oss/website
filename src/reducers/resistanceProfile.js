import React from 'react';
import classnames from 'classnames';

import { FETCH_ENTITIES } from '../actions/fetch';
import { SET_COLOUR_COLUMNS, SHOW_TABLE_VIEW } from '../collection-viewer/table/actions';

import Species from '../species';
import * as resistanceProfile from '../utils/resistanceProfile';
import { canvas, measureText } from '../table/utils/columnWidth';

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

function createAntibioticsColumn({ name, longName }) {
  const columnKey = name;
  const hoverName = longName || name;

  return {
    columnKey,
    isExpandable() {
      return this.isSelected && this.allMechanisms.length;
    },
    getLabel() {
      return this.isExpandable() ? hoverName : name.slice(0, 3);
    },
    headerClasses: 'wgsa-table-header--resistance',
    headerTitle: `${hoverName} - ${modifierKey} + click to select multiple`,
    cellClasses: 'wgsa-table-cell--resistance',
    getWidth(mechanisms) {
      if (!this.isExpandable()) {
        return 40;
      }

      canvas.font = '700 13px "Helvetica","Arial",sans-serif';
      return Math.floor(
        mechanisms.reduce((width, m) => width + measureText(m, 8), 0),
      ) + 16;
    },
    cellPadding: 16,
    addState({ data }) {
      const allMechanisms = data.reduce((memo, row) => {
        const { antibiotics } = row.analysis.resistanceProfile;
        if (!antibiotics || !antibiotics[this.columnKey]) return memo;
        for (const m of antibiotics[this.columnKey].mechanisms) {
          memo.add(m);
        }
        return memo;
      }, new Set());

      this.allMechanisms = Array.from(allMechanisms).sort();
      this.width = this.getWidth(this.allMechanisms);

      return this;
    },
    getCellContents(props, { analysis }) {
      const { antibiotics } = analysis.resistanceProfile;
      const isResistant =
        resistanceProfile.isResistant(analysis.resistanceProfile, props.columnKey);
      if (isResistant) {
        const { state, mechanisms } = antibiotics[props.columnKey];
        const activeMechanisms = new Set(mechanisms);
        return props.isSelected ? (
          <span className="wgsa-resistance-mechanism-list ">
            {props.allMechanisms.map(mechanism =>
              <button
                key={mechanism}
                className={classnames(
                  'wgsa-resistance-mechanism',
                  { [`wgsa-amr--${state.toLowerCase()}`]: activeMechanisms.has(mechanism) }
                )}
              >
                {mechanism}
              </button>)
            }
          </span>
        ) : (
          <i
            className={`material-icons wgsa-resistance-icon wgsa-amr--${state.toLowerCase()}`}
            title={mechanisms.join(', ')}
          >
            {resistanceProfile.getIcon(state)}
          </i>
        );
      }
      return null;
    },
    valueGetter: assembly => resistanceProfile.getColour(name, assembly),
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
  SNPs: ({ snp }) => snp.map(name => ({
    columnKey: name,
    cellClasses: 'wgsa-table-cell--resistance',
    getLabel() {
      return name;
    },
    getWidth() {
      return measureText(name, true) + 4;
    },
    cellPadding: 16,
    getCellContents(props, { analysis }) {
      return analysis.resistanceProfile.snp.indexOf(name) !== -1 ? (
        <i className="material-icons wgsa-resistance-icon wgsa-amr--resistant">
          {resistanceProfile.getIcon('RESISTANT')}
        </i>
      ) : null;
    },
    valueGetter: assembly => resistanceProfile.getColour(name, assembly),
    onHeaderClick: resistanceProfile.onHeaderClick,
  })),
  Genes: ({ paar }) => paar.map(name => ({
    columnKey: name,
    cellClasses: 'wgsa-table-cell--resistance',
    getLabel() {
      return name;
    },
    getWidth() {
      return measureText(name, true) + 4;
    },
    cellPadding: 16,
    getCellContents(props, { analysis }) {
      return analysis.resistanceProfile.paar.indexOf(name) !== -1 ? (
        <i className="material-icons wgsa-resistance-icon wgsa-amr--resistant">
          {resistanceProfile.getIcon('RESISTANT')}
        </i>
      ) : null;
    },
    valueGetter: assembly => resistanceProfile.getColour(name, assembly),
    onHeaderClick: resistanceProfile.onHeaderClick,
  })),
};

function buildColumns(view, libraries) {
  return [
    { columnKey: '__spacer_l',
      getHeaderContent() {},
      fixed: true,
      fixedWidth: 1,
      getCellContents() {},
    },
    ...systemColumnProps,
    ...viewColumnBuilders[view](libraries),
    { columnKey: '__spacer_r',
      getHeaderContent() {},
      fixedWidth: 8,
      getCellContents() {},
      cellClasses: 'wgsa-table-cell--resistance',
    },
  ];
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
      const { antibiotics, paar, snp } = payload.result[2];

      const libraries = {
        antibiotics: antibiotics.map(ab => (typeof ab === 'string' ? { name: ab } : ab)),
        paar, snp,
      };

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
