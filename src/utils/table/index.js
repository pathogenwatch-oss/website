export const getCellValue = ({ valueGetter }, data) => valueGetter(data);

export const formatColumnLabel =
  (columnkey) => columnkey.replace(/^__/, '').replace(/_/g, ' ').toUpperCase();


export function sortAssemblies(assemblies, id1, id2) {
  const assembly1 = assemblies[id1];
  const assembly2 = assemblies[id2];

  if (assembly1.metadata.assemblyName < assembly2.metadata.assemblyName) {
    return -1;
  }

  if (assembly1.metadata.assemblyName > assembly2.metadata.assemblyName) {
    return 1;
  }

  return 0;
}
