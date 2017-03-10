import { FETCH_COLLECTION } from '../../collection-viewer/actions';
import { SET_LABEL_COLUMN } from '../table/actions';
import { onHeaderClick } from './thunks';

import { hasTyping } from './utils';

import { systemDataColumns } from './constants';
import * as constants from '../table/constants';
import { tableKeys } from '../constants';

import Organisms from '../../organisms';

const initialState = {
  name: tableKeys.typing,
  activeColumn: constants.nameColumnProps,
  columns: [],
  onHeaderClick,
};

export const leadingSystemGroup = {
  group: true,
  system: true,
  fixed: true,
  columnKey: 'leadingSystemGroup',
  getHeaderContent() {},
  columns: [
    constants.leftSpacerColumn,
    constants.downloadColumnProps,
    constants.nameColumnProps,
  ],
};

export const trailingSystemGroup = {
  group: true,
  system: true,
  columnKey: 'trailingSystemGroup',
  getHeaderContent() {},
  columns: [
    constants.rightSpacerColumn,
  ],
};

const referenceGroup = {
  columnKey: 'reference',
  group: true,
  columns: [ '__wgsa_reference' ],
  getHeaderContent: () => {},
};

const mlstGroup = {
  group: true,
  columnKey: 'mlst',
  columns: [ '__mlst', '__mlst_profile' ],
};

const ngMastGroup = {
  group: true,
  columnKey: 'ngMast',
  columns: [ '__ng-mast', '__por', '__tbpb' ],
};

const genotyphigroup = {
  group: true,
  columnKey: 'genotyphi',
  columns: [ '__genotyphi_type', '__genotyphi_snps', '__genotyphi_found_loci' ],
};

function fillColumnDefs({ columns, ...group }) {
  return {
    ...group,
    noAction: true,
    headerClasses: 'wgsa-table-header--unstyled',
    columns: columns.map(key => systemDataColumns[key]),
  };
}

export function getTypingColumnGroups(uiOptions) {
  return [
    uiOptions.noPopulation ? null : referenceGroup,
    uiOptions.noMLST ? null : mlstGroup,
    uiOptions.ngMast ? ngMastGroup : null,
    uiOptions.genotyphi ? genotyphigroup : null,
  ].
  filter(_ => _).
  map(fillColumnDefs);
}

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_COLLECTION.SUCCESS: {
      const active = hasTyping(Organisms.uiOptions);

      if (!active) {
        return {
          ...state,
          active,
        };
      }

      return {
        ...state,
        active,
        columns: [
          leadingSystemGroup,
          ...getTypingColumnGroups(Organisms.uiOptions),
          trailingSystemGroup,
        ],
      };
    }
    case SET_LABEL_COLUMN:
      if (payload.table !== tableKeys.typing) return state;
      return {
        ...state,
        activeColumn: payload.column,
      };
    default:
      return state;
  }
}
