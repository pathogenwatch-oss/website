import { tableKeys } from '../table/constants';
import Species from '../../species';

// TODO: Might be good if `date` and `userDefined` were null
export function hasMetadata(genomes) {
  return (
    genomes.some(({ date, pmid, userDefined }) =>
      !!(date.year || pmid || Object.keys(userDefined).length)
    )
  );
}

export function getTypingColumns(uiOptions) {
  return [
    uiOptions.noPopulation ? null : '__wgsa_reference',
    ...(uiOptions.noMLST ? [] : [ '__mlst', '__mlst_profile' ]),
    ...(uiOptions.ngMast ? [ '__ng-mast', '__por', '__tbpb' ] : []),
    ...(uiOptions.genotyphi ? [ '__genotyphi_type', '__genotyphi_snps' ] : []),
  ].filter(_ => _);
}

export function getInitialTable({ genomes }) {
  if (hasMetadata(genomes)) return tableKeys.metadata;
  if (getTypingColumns(Species.uiOptions).length) return tableKeys.typing;
  return tableKeys.stats;
}
