export function sortAssemblies(assemblies) {
  return assemblies.sort((assembly1, assembly2) => {
    if (assembly1.name < assembly2.name) {
      return -1;
    }

    if (assembly1.name > assembly2.name) {
      return 1;
    }

    return 0;
  });
}
