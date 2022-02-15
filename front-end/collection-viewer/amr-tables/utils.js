
import { FETCH_COLLECTION } from '~/collection-viewer/actions';
import { SET_COLOUR_COLUMNS } from '../table/actions';
import { measureHeadingText, measureText, weights } from '../table/columnWidth';
import * as constants from '../table/constants';
import { statuses } from '~/collection-viewer/constants';

const isMac =
  (navigator && navigator.platform &&
    navigator.platform.toUpperCase().indexOf('MAC') >= 0);

export const modifierKey = isMac ? 'Cmd' : 'Ctrl';

export const systemGroup = {
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

export const spacerGroup = {
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
        const { genomes, status } = payload.result;
        if (status !== statuses.READY ) return state;

        const paarsnpResults = getPaarsnpResults(genomes);
        if (paarsnpResults.length === 0) return state;
        const columns = buildColumns(paarsnpResults);
        return {
          ...state,
          columns:
            columns.length && columns[0].group ?
              [ systemGroup, ...columns, spacerGroup ] :
              [ ...systemGroup.columns, ...columns, ...spacerGroup.columns ],
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

export function calculateHeaderWidthAlternative(label, children) {
  const minWidth = measureHeadingText(label) + 16;
  const childWidth = children.map(child => measureHeadingText(child) + 16).reduce((sum, length) => sum += length, 0);
  return minWidth < childWidth ?
    { fixedWidth: childWidth, bufferSize: 0 } :
    { fixedWidth: minWidth, bufferSize: (minWidth - childWidth) / children.length };
}

export function calculateHeaderWidth(label, numChildren) {
  const minWidth = measureHeadingText(label) + 16;
  const childWidth = numChildren * 16;
  return minWidth < childWidth ?
    { fixedWidth: childWidth, bufferSize: 0 } :
    { fixedWidth: minWidth, bufferSize: (minWidth - childWidth) / numChildren };
}

