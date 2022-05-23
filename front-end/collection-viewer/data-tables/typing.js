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

const ngonoMarkersGroup = {
  group: true,
  columnKey: 'other',
  columns: [ '__porA' ],
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

const kaptiveGroup = {
  group: true,
  columnKey: 'kaptive',
  columns: [ '__K_locus_kaptive', '__K_type_kaptive', '__O_locus_kaptive' ],
};

const kleborateGroup = {
  group: true,
  columnKey: 'kleborate',
  // TODO: add the type columns back in once kleborate v2.2.0 update goes live.
  columns: [ '__K_locus', '__O_locus', '__Virulence_Score', '__Aerobactin', '__Colibactin', '__Salmochelin', '__Yersiniabactin', '__RmpADC', '__rmpA2' ],
  // columns: [ '__K_locus', '__K_type', '__O_locus', '__O_type', '__Virulence_Score', '__Aerobactin', '__Colibactin', '__Salmochelin', '__Yersiniabactin', '__RmpADC', '__rmpA2' ],
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

function getTypingColumnGroups(uiOptions, hasAltMLST, {
  genotyphi,
  inctyper,
  kaptive,
  kleborate,
  mlst,
  ngmast,
  "ngono-markers": ngonoMarkers,
  ngstar,
  pangolin,
  vista,
}) {
  return [
    !uiOptions.hasPopulation ? null : referenceGroup,
    mlst ? mlstGroup : null,
    hasAltMLST ? mlst2Group : null,
    ngstar ? ngStarGroup : null,
    ngmast ? ngMastGroup : null,
    ngonoMarkers ? ngonoMarkersGroup : null,
    genotyphi ? genotyphiGroup : null,
    inctyper ? inctyperGroup : null,
    kaptive ? kaptiveGroup : null,
    kleborate ? kleborateGroup : null,
    vista ? vistaGroup : null,
    pangolin ? pangolinGroup : null,
  ]
    .filter(_ => _) // removes the nulls
    .map(fillColumnDefs);
}

export function hasTyping({ hasPopulation }, {
  genotyphi,
  inctyper,
  kaptive,
  kleborate,
  mlst,
  "ngono-markers": ngonoMarkers,
  ngmast,
  ngstar,
  pangolin,
  vista,
}) {
  return !(!hasPopulation && !mlst && !genotyphi && !inctyper && !kaptive && !kleborate && !ngmast && !!ngonoMarkers && !ngstar && !pangolin && !vista);
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

function checkAnalysesPresent({ exclude = [] }, { genomes }, analyses) {
  return analyses.filter(analysis => !exclude.includes(analysis)).reduce((memo, analysis) => {
    // eslint-disable-next-line no-param-reassign
    memo[analysis] = !!genomes[0].analysis[analysis];
    return memo;
  }, {});
}

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_COLLECTION.SUCCESS: {
      const foundAnalyses = checkAnalysesPresent(Organisms.uiOptions, payload.result, [ 'genotyphi', 'inctyper', 'kaptive', 'kleborate', 'mlst', 'ngmast', 'ngono-markers', 'ngstar', 'pangolin', 'vista' ]);
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
          ...getTypingColumnGroups(Organisms.uiOptions, hasAltMLST, foundAnalyses),
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
