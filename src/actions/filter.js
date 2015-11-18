
export const SET_VISIBLE_ASSEMBLY_IDS = 'SET_VISIBLE_ASSEMBLY_IDS';

export function setVisibleAssemblyIds(assemblyIds) {
  return {
    type: SET_VISIBLE_ASSEMBLY_IDS,
    assemblyIds,
  };
}
