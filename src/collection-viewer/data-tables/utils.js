import { tableKeys } from '../table/constants';
import Species from '../../species';

// TODO: Might be good if `date` and `userDefined` were null
export function hasMetadata(assemblies) {
  return (
    Object.keys(assemblies).
      some(key => {
        const { metadata: { date, userDefined } } = assemblies[key];
        return !!(date.year || Object.keys(userDefined).length);
      })
  );
}

export function getTypingColumns(uiOptions) {
  return [
    uiOptions.noPopulation ? null : '__wgsa_reference',
    ...(uiOptions.noMLST ? [] : [ '__mlst', '__mlst_profile' ]),
    ...(uiOptions.ngMast ? [ '__ng-mast', '__por', '__tbpb' ] : []),
    uiOptions.genotyphi ? '__genotyphi_type' : null,
  ].filter(_ => _);
}

export function getInitialTable([ { assemblies } ]) {
  if (hasMetadata(assemblies)) return tableKeys.metadata;
  if (getTypingColumns(Species.uiOptions).length) return tableKeys.typing;
  return tableKeys.stats;
}
