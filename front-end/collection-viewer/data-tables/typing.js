import { FETCH_COLLECTION } from '../actions';
import { SET_LABEL_COLUMN } from '../table/actions';
import { onHeaderClick } from './thunks';

import { systemDataColumns } from './constants';
import * as constants from '../table/constants';
import { tableKeys } from '../constants';

import Organisms from '~/organisms';
import { resetSources, sources } from './utils';
import { formatMlstSource, formatSchemeName } from "~/utils/mlst";

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
  columns: ['__reference'],
  getHeaderContent: () => {
  },
};

const cgmlstClassificationGroup = {
  columnKey: 'cgst',
  group: true,
  columns: ['__cgmlst', '__cgmlst_lincode', '__cgmlst_sublineage', '__cgmlst_clonalgroup'],
  get label() {
    return 'CGMLST CLASSIFICATION';
  },
};

const mlstHeaderLength = 19;
const mlstGroup = {
  group: true,
  columnKey: 'mlst',
  columns: ['__mlst', '__mlst_profile'],
  get headerTitle() {
    return sources.mlst;
  },
  get label() {
    return `MLST - ${sources.mlst.length > mlstHeaderLength ? sources.mlst.substring(0, mlstHeaderLength - 3) : sources.mlst}${sources.mlst.length > mlstHeaderLength ? '...' : ''}`;
  },
};

const mlst2Group = {
  group: true,
  columnKey: 'mlst2',
  columns: ['__mlst2', '__mlst2_profile'],
  get headerTitle() {
    return sources.mlst2;
  },
  title: sources.mlst2,
  get label() {
    return `MLST - ${sources.mlst2.length > mlstHeaderLength ? sources.mlst2.substring(0, mlstHeaderLength - 3) : sources.mlst2}${sources.mlst2.length > mlstHeaderLength ? '...' : ''}`;
  },
};

const ngMastGroup = {
  group: true,
  columnKey: 'ng-Mast',
  columns: ['__ng-mast', '__por', '__tbpb'],
};

const ngonoMarkersGroup = {
  group: true,
  columnKey: 'other',
  columns: ['__porA'],
};

const ngStarGroup = {
  group: true,
  columnKey: 'ng-star',
  columns: ['__ngstar', '__ngstar_profile'],
};

const pangolinGroup = {
  group: true,
  columnKey: 'pangolin',
  columns: ['__pangolin'],
};

const genotyphiGroup = {
  group: true,
  columnKey: 'genotyphi',
  columns: ['__genotyphi_type', '__genotyphi_snps_called'],
};

const inctyperGroup = {
  group: true,
  columnKey: 'inctyper',
  columns: ['__inc_types'],
};

const kaptiveGroup = {
  group: true,
  columnKey: 'kaptive',
  columns: ['__K_locus_kaptive', '__K_type_kaptive', '__O_locus_kaptive', '__O_type_kaptive'],
};

const kleborateGroup = {
  group: true,
  columnKey: 'kleborate',
  columns: ['__Virulence_Score', '__Aerobactin', '__Colibactin', '__Salmochelin', '__Yersiniabactin', '__RmpADC', '__rmpA2'],
};

const poppunk2Group = {
  group: true,
  columnKey: 'poppunk2',
  columns: ['__poppunk2_strain'],
  get label() {
    return sources.poppunk2.name;
  },
};

const serotypeGroup = {
  group: true,
  columnKey: 'serotype',
  columns: ['__serotype'],
};

const vistaGroup = {
  group: true,
  columnKey: 'vista',
  columns: [ '__vista_serogroup' ],
};

function fillColumnDefs({columns, ...group}) {
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
  'kleborate__virulence': kleborate,
  'klebsiella-lincodes': klebsiellaLincodes,
  mlst,
  ngmast,
  "ngono-markers": ngonoMarkers,
  ngstar,
  pangolin,
  poppunk2,
  serotype,
  vista,
}) {
  return [
    serotype ? serotypeGroup : null,
    !uiOptions.hasPopulation ? null : referenceGroup,
    mlst ? mlstGroup : null,
    klebsiellaLincodes ? cgmlstClassificationGroup : null,
    hasAltMLST ? mlst2Group : null,
    ngstar ? ngStarGroup : null,
    ngmast ? ngMastGroup : null,
    ngonoMarkers ? ngonoMarkersGroup : null,
    genotyphi ? genotyphiGroup : null,
    inctyper ? inctyperGroup : null,
    kaptive ? kaptiveGroup : null,
    kleborate ? kleborateGroup : null,
    pangolin ? pangolinGroup : null,
    poppunk2 ? poppunk2Group : null,
    vista ? vistaGroup : null,
  ]
    .filter(_ => _) // removes the nulls
    .map(fillColumnDefs);
}

export function hasTyping({hasPopulation}, {
  genotyphi,
  inctyper,
  kaptive,
  kleborate,
  'klebsiella-lincodes': klebsiellaLincodes,
  mlst,
  "ngono-markers": ngonoMarkers,
  ngmast,
  ngstar,
  pangolin,
  poppunk2,
  serotype,
  vista,
}) {
  return !(!hasPopulation && !mlst && !genotyphi && !inctyper && !kaptive && !(kleborate && kleborate.virulence) && !klebsiellaLincodes && !ngmast && !!ngonoMarkers && !ngstar && !pangolin && !poppunk2 && !serotype && !vista);
}

/**
 * This function is doing something abit confused. It fixes the task sources for various inputs and then returns true
 * `mlst2` is present.
 * @param genomes
 * @returns {boolean}
 */
function updateTypingSettings({ genomes }) {
  resetSources();
  const sourceTasks = new Set(['mlst', 'mlst2']);
  for (const {analysis} of genomes) {
    for (const task of sourceTasks) {
      if (task in analysis) {
        sources[task] = `${formatSchemeName(analysis[task].schemeName)} (${formatMlstSource(analysis[task].source)})`;
        sourceTasks.delete(task);
      }
    }
    // genome assumed to have mlst(1), which means sources are complete
    if ("poppunk2" in analysis) {
      if ("label" in analysis.poppunk2 && analysis.poppunk2.label !== "GPSC") {
        sources.poppunk2 = {
          name: "LINEAGE",
          label: analysis.poppunk2.label,
        };
      } else {
        sources.poppunk2 = {
          name: "STRAIN",
          label: "GPSC",
        };
      }
    }
    if ("kaptive" in analysis) {
      sources.kaptiveOLocus = {
        name: analysis.kaptive.oLocus.name,
        label: analysis.kaptive.oLocus.name,
      };
    }
    if (analysis.mlst2) return true;
  }
  return false;
}

function checkNested(obj, level,  ...rest) {
  if (obj === undefined) return false
  if (rest.length === 0 && obj.hasOwnProperty(level)) return true
  return checkNested(obj[level], ...rest)
}

function checkAnalysesPresent({ exclude = [] }, { genomes }, analyses, nestedAnalyses) {
  const found = analyses.filter(analysis => !exclude.includes(analysis)).reduce((memo, analysis) => {
    // eslint-disable-next-line no-param-reassign
    memo[analysis] = !!genomes[0].analysis[analysis];
    return memo;
  }, {});

  const extra = nestedAnalyses.filter(analysis => !exclude.includes(analysis[0])).reduce((memo, analysis) => {
    memo[analysis.join("__")] = checkNested(genomes[0].analysis[analysis[0]], ...analysis.slice(1));
    return memo;
  }, {});

  return {...found, ...extra};
}

export default function (state = initialState, {type, payload}) {
  switch (type) {
    case FETCH_COLLECTION.SUCCESS: {
      const foundAnalyses = checkAnalysesPresent(Organisms.uiOptions, payload.result, [ 'klebsiella-lincodes', 'genotyphi', 'inctyper', 'kaptive', 'mlst', 'ngmast', 'ngono-markers', 'ngstar', 'pangolin', 'poppunk2', 'serotype', 'vista' ], [["kleborate", "virulence"]]);
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
