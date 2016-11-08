import React from 'react';
import classnames from 'classnames';

import { FETCH_ENTITIES } from '../actions/fetch';
import { SET_COLOUR_COLUMNS } from '../actions/table';

import Species from '../species';
import * as resistanceProfile from '../utils/resistanceProfile';
import { canvas, measureText } from '../table/utils/columnWidth';

import { downloadColumnProps, nameColumnProps } from '../constants/table';

const systemColumnProps = [
  downloadColumnProps,
  { ...nameColumnProps,
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
    flexGrow: 0,
    addState({ data }) {
      const allMechanisms = data.reduce((memo, row) => {
        const { analysis = {} } = row;
        if (!analysis.resistanceProfile) return memo;
        const { mechanisms = [] } = analysis.resistanceProfile[this.columnKey];
        for (const m of mechanisms) {
          memo.add(m);
        }
        return memo;
      }, new Set());

      this.allMechanisms = Array.from(allMechanisms).sort();
      this.width = this.getWidth(this.allMechanisms);

      return this;
    },
    getCellContents(props, { analysis = {} }) {
      const isResistant =
        resistanceProfile.isResistant(analysis.resistanceProfile, props.columnKey);
      if (isResistant) {
        const { state, mechanisms } = analysis.resistanceProfile[props.columnKey];
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
    valueGetter: (assembly) => resistanceProfile.getColour(name, assembly),
    onHeaderClick: resistanceProfile.onHeaderClick,
  };
}

function buildAntibioticColumnProps(antibiotics) {
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
}

const actions = {
  [FETCH_ENTITIES.SUCCESS](state, { result }) {
    const antibiotics = result[2];

    const columns = [
      { columnKey: '__spacer_l',
        getHeaderContent() {},
        fixed: true,
        fixedWidth: 1,
        getCellContents() {},
      },
      ...systemColumnProps,
      ...buildAntibioticColumnProps(antibiotics),
      { columnKey: '__spacer_r',
        getHeaderContent() {},
        fixedWidth: 8,
        getCellContents() {},
        cellClasses: 'wgsa-table-cell--resistance',
      },
    ];

    return { ...state, columns };
  },
  [SET_COLOUR_COLUMNS](state, { columns }) {
    return {
      ...state,
      activeColumns: columns,
    };
  },
};

const initialState = {
  activeColumns: new Set(),
  columns: [],
};

export default { actions, initialState };
