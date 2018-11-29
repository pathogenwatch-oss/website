import { FETCH_COLLECTION } from '../actions';
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
  getHeaderContent() {
  },
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
  getHeaderContent() {
  },
  columns: [
    constants.rightSpacerColumn,
  ],
};

const referenceGroup = {
  columnKey: 'reference',
  group: true,
  columns: [ '__reference' ],
  getHeaderContent: () => {
  },
};

const mlstGroup = {
  group: true,
  columnKey: 'mlst',
  columns: [ '__mlst', '__mlst_profile' ],
};

const ngMastGroup = {
  group: true,
  columnKey: 'ng-Mast',
  columns: [ '__ng-mast', '__por', '__tbpb' ],
};

const genotyphiGroup = {
  group: true,
  columnKey: 'genotyphi',
  columns: [ '__genotyphi_type', '__genotyphi_snps_called' ],
};

const inctyperGroup = {
  group: true,
  columnKey: 'inctyper',
  columns: [ '__inc_types' ],
};

const kleborateGroup = {
  group: true,
  columnKey: 'kleborate',
  columns: [ '__kleborate_species', '__kleborate_mlst', '__virulence_score', '__resistance_score', '__K_locus', '__K_locus_confidence', '__O_locus', '__O_locus_confidence', '__wzi', '__Aerobactin', '__AbST', '__Colibactin', '__CbST', '__Salmochelin', '__SmST', '__Yersiniabactin', '__YbST', '__rmpA', '__rmpA2' ],
};

const kleborateAmrGroup = {
  group: true,
  columnKey: 'kleborate_amr',
  columns: [ '__AGly', '__Col', '__Fcyn', '__Flq', '__Gly', '__MLS', '__Ntmdz', '__Phe', '__Rif', '__Sul', '__Tet', '__Tmt', '__Bla', '__Bla_Carb', '__Bla_ESBL', '__Bla_ESBL_inhR', '__Bla_broad', '__Bla_broad_inhR' ],
};

function fillColumnDefs({ columns, ...group }) {
  return {
    ...group,
    noAction: true,
    headerClasses: 'wgsa-table-header--unstyled',
    columns: columns.map(key => systemDataColumns[key]),
  };
}

export function getTypingColumnGroups({ isClusterView }, uiOptions) {
  return [
    isClusterView || uiOptions.noPopulation ? null : referenceGroup,
    uiOptions.noMLST ? null : mlstGroup,
    uiOptions.ngMast ? ngMastGroup : null,
    uiOptions.genotyphi ? genotyphiGroup : null,
    uiOptions.inctyper ? inctyperGroup : null,
    uiOptions.kleborate ? kleborateGroup : null,
    uiOptions.kleborate ? kleborateAmrGroup : null,
  ]
    .filter(_ => _)
    .map(fillColumnDefs);
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
          ...getTypingColumnGroups(payload.result, Organisms.uiOptions),
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
