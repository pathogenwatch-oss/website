export function sortGenomes(genomes) {
  return genomes.sort((genome1, genome2) => {
    if (genome1.name < genome2.name) {
      return -1;
    }

    if (genome1.name > genome2.name) {
      return 1;
    }

    return 0;
  });
}

export function getUuidFromSlug(slug) {
  return slug.split('-')[0];
}
