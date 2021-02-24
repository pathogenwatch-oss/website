import { FETCH_COLLECTION } from '../actions';
import { SET_LABEL_COLUMN } from '../table/actions';
import { onHeaderClick } from './thunks';

import { systemDataColumns } from './constants';
import * as constants from '../table/constants';
import { tableKeys } from '../constants';

import Organisms from '~/organisms';
import { resetSources, sources } from './utils';

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

const ngStarGroup = {
  group: true,
  columnKey: 'ng-star',
  columns: [ '__ngstar', '__ngstar_profile' ],
};

const pangolinGroup = {
  group: true,
  columnKey: 'pangolin',
  columns: [ '__pangolin' ],
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
  columns: [ '__K_locus', '__O_locus', '__Virulence_Score', '__Aerobactin', '__Colibactin', '__Salmochelin', '__Yersiniabactin', '__RmpADC', '__rmpA2' ],
};

const vistaGroup = {
  group: true,
  columnKey: 'vista',
  columns: [ '__vista_biotype', '__vista_serogroup' ],
};

function fillColumnDefs({ columns, ...group }) {
  return {
    ...group,
    noAction: true,
    headerClasses: 'wgsa-table-header--unstyled',
    columns: columns.map(key => systemDataColumns[key]),
  };
}

function getTypingColumnGroups({ isClusterView }, uiOptions, hasAltMLST, { genotyphi, inctyper, kleborate, pangolin, vista }) {
  return [
    isClusterView || uiOptions.noPopulation ? null : referenceGroup,
    uiOptions.noMLST ? null : mlstGroup,
    hasAltMLST ? mlst2Group : null,
    uiOptions.ngMast ? ngStarGroup : null,
    uiOptions.ngMast ? ngMastGroup : null,
    genotyphi ? genotyphiGroup : null,
    inctyper ? inctyperGroup : null,
    kleborate ? kleborateGroup : null,
    vista ? vistaGroup : null,
    pangolin ? pangolinGroup : null,
  ]
    .filter(_ => _) // removes the nulls
    .map(fillColumnDefs);
}

export function hasTyping({ noPopulation, noMLST, ngMast }, { genotyphi, inctyper, kleborate, pangolin, vista }) {
  return !(noPopulation && noMLST && !ngMast && !genotyphi && !inctyper && !kleborate && !pangolin && !vista);
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

function checkAnalysesPresent({ genomes }, analyses) {
  return analyses.reduce((memo, analysis) => {memo[analysis] = !!genomes[0].analysis[analysis]; return memo;}, {});
}

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_COLLECTION.SUCCESS: {

      const foundAnalyses = checkAnalysesPresent(payload.result, ['genotyphi', 'inctyper', 'kleborate', 'pangolin', 'vista']);
      const active = hasTyping(Organisms.uiOptions, foundAnalyses);

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
          ...getTypingColumnGroups(payload.result, Organisms.uiOptions, hasAltMLST, foundAnalyses),
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
