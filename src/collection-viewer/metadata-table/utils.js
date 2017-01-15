import { systemDataColumns } from './constants';

function getSystemDataColumnKeys(uiOptions = {}) {
  return (
    [ '__date' ].
      concat(uiOptions.noPopulation ? [] : [ '__wgsa_reference', '__st' ]).
      concat(uiOptions.noMLST ? [] : [ '__profile' ]).
      concat(uiOptions.ngMast ? [ '__ng-mast', '__por', '__tbpb' ] : []).
      concat(uiOptions.genotyphi ? [ '__genotyphi_type' ] : []).
      concat([
        '__core_matches',
        '__%_core_families',
        '__%_non-core',
        '__genome_length',
        '__n50',
        '__no._contigs',
        '__non-ATCG',
        '__GC_Content',
      ])
  );
}

export function getSystemDataColumnProps(uiOptions) {
  return getSystemDataColumnKeys(uiOptions).map(key => systemDataColumns[key]);
}

export const getUserDefinedValue =
  (column, { userDefined }) => userDefined[column];
