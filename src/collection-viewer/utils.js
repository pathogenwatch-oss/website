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

export function formatGenomeRecords(genomes) {
  return genomes.map(genome => {
    const analysis = { ...genome.analysis };
    if (analysis.paarsnp && Array.isArray(analysis.paarsnp.antibiotics)) {
      const { antibiotics = [] } = analysis.paarsnp;
      analysis.paarsnp = {
        ...analysis.paarsnp,
        antibiotics: antibiotics.reduce((memo, antibiotic) => {
          memo[antibiotic.name] = antibiotic;
          return memo;
        }, {}),
      };
    }
    const uuid = genome.uuid || genome.id || genome._id;
    return {
      ...genome,
      uuid,
      analysis,
      position: genome.position || {
        latitude: genome.latitude,
        longitude: genome.longitude,
      },
    };
  });
}
