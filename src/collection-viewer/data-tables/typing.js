import { FETCH_COLLECTION } from '../actions';
import { SET_LABEL_COLUMN } from '../table/actions';
import { onHeaderClick } from './thunks';

import { systemDataColumns } from './constants';
import * as constants from '../table/constants';
import { tableKeys } from '../constants';

import Organisms from '~/organisms';
import { sources, resetSources } from './utils';

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
  get label() {
    return `MLST - ${sources.mlst}`;
  },
};

const mlst2Group = {
  group: true,
  columnKey: 'mlst2',
  columns: [ '__mlst2', '__mlst2_profile' ],
  get label() {
    return `MLST - ${sources.mlst2}`;
  },
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
  columns: [ '__K_locus', '__O_locus', '__Virulence_Score', '__Aerobactin', '__Colibactin', '__Salmochelin', '__Yersiniabactin', '__rmpA', '__rmpA2' ],
};

function fillColumnDefs({ columns, ...group }) {
  return {
    ...group,
    noAction: true,
    headerClasses: 'wgsa-table-header--unstyled',
    columns: columns.map(key => systemDataColumns[key]),
  };
}

function getTypingColumnGroups({ isClusterView }, uiOptions, hasAltMLST) {
  return [
    isClusterView || uiOptions.noPopulation ? null : referenceGroup,
    uiOptions.noMLST ? null : mlstGroup,
    hasAltMLST ? mlst2Group : null,
    uiOptions.ngMast ? ngMastGroup : null,
    uiOptions.genotyphi ? genotyphiGroup : null,
    uiOptions.inctyper ? inctyperGroup : null,
    uiOptions.kleborate ? kleborateGroup : null,
  ]
    .filter(_ => _) // removes the nulls
    .map(fillColumnDefs);
}

export function hasTyping({ noPopulation, noMLST, ngMast, genotyphi }) {
  if (noPopulation && noMLST && !ngMast && !genotyphi) return false;
  return true;
}

function updateTypingSettings({ genomes }) {
  resetSources();
  const sourceTasks = new Set([ 'mlst', 'mlst2' ]);
  for (const { analysis } of genomes) {
    for (const task of sourceTasks) {
      if (task in analysis) {
        sources[task] = analysis[task].source;
        sourceTasks.delete(task);
      }
    }
    // genome assumed to have mlst(1), which means sources are complete
    if (analysis.mlst2) return true;
  }
  return false;
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

      const hasAltMLST = updateTypingSettings(payload.result);

      return {
        ...state,
        active,
        columns: [
          leadingSystemGroup,
          ...getTypingColumnGroups(payload.result, Organisms.uiOptions, hasAltMLST),
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
