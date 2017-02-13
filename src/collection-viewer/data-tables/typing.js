import { FETCH_COLLECTION } from '../../collection-route/actions';
import { SET_LABEL_COLUMN } from '../table/actions';
import { onHeaderClick } from './thunks';

import { hasTyping } from './utils';

import { systemDataColumns } from './constants';
import * as constants from '../table/constants';

import Species from '../../species';

const { tableKeys } = constants;

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
  columnKey: 'mlst', group: true, columns: [ '__mlst', '__mlst_profile' ],
};

const ngMastGroup = {
  columnKey: 'ngMast', group: true, columns: [ '__ng-mast', '__por', '__tbpb' ],
};

const genotyphigroup = {
  columnKey: 'genotyphi', group: true,
  columns: [ '__genotyphi_type', '__genotyphi_snps', '__genotyphi_found_loci' ],
};

function fillColumnDefs({ columns, ...group }) {
  return {
    ...group,
    onHeaderClick: () => {},
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
      const active = hasTyping(Species.uiOptions);

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
          ...getTypingColumnGroups(Species.uiOptions),
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
