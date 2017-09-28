function mergeMatches(paar = {}, snpar = {}) {
  const matches = [];
  for (const { resistanceSetName, agents, elementIds } of paar.completeResistanceSets) {
    for (const elementId of elementIds) {
      for (const match of (paar.blastMatches[elementId] || [])) {
        matches.push({
          agents,
          id: resistanceSetName,
          source: 'WGSA_PAAR',
          type: 'CDS',
          reversed: match.reversed,
          evalue: match.evalue,
          identity: match.percentIdentity,
          library: {
            stop: match.librarySequenceStop,
            start: match.librarySequenceStart,
            length: match.librarySequenceLength,
            id: match.librarySequenceId,
          },
          query: {
            stop: match.querySequenceStop,
            start: match.querySequenceStart,
            length: match.querySequenceLength,
            id: match.querySequenceId,
          },
        });
      }
    }
  }
  for (const { resistanceSetName, agents } of snpar.completeSets) {
    for (const { searchStatistics, snpResistanceElements } of snpar.blastMatches) {
      if (resistanceSetName.startsWith(searchStatistics.librarySequenceId)) {
        matches.push({
          id: resistanceSetName,
          source: 'WGSA_SNPAR',
          type: 'CDS',
          reversed: searchStatistics.reversed,
          evalue: searchStatistics.evalue,
          identity: searchStatistics.percentIdentity,
          library: {
            stop: searchStatistics.librarySequenceStop,
            start: searchStatistics.librarySequenceStart,
            length: searchStatistics.librarySequenceLength,
            id: searchStatistics.librarySequenceId,
          },
          query: {
            stop: searchStatistics.querySequenceStop,
            start: searchStatistics.querySequenceStart,
            length: searchStatistics.querySequenceLength,
            id: searchStatistics.querySequenceId,
          },
        });
        for (const { causalMutations, resistanceMutation } of snpResistanceElements) {
          for (const mutation of causalMutations) {
            matches.push({
              agents,
              id: searchStatistics.querySequenceId,
              source: 'WGSA_SNPAR',
              type: 'point_mutation',
              reversed: searchStatistics.reversed,
              queryLocation: mutation.queryLocation,
              referenceLocation: mutation.referenceLocation,
              name: resistanceMutation.name,
              libraryStart: searchStatistics.librarySequenceStart,
            });
          }
        }
      }
    }
  }
  return matches;
}

module.exports = result => ({
  antibiotics: result.resistanceProfile ?
    result.resistanceProfile.map(
      ({ agent, resistanceState, resistanceSets }) => ({
        name: agent.name,
        fullName: agent.fullName,
        state: resistanceState,
        mechanisms: resistanceSets.reduce(
          (memo, _) => memo.concat(_.elementIds), []
        ),
      })
    ) : [],
  paar: result.paarResult ?
    result.paarResult.paarElementIds || [] : [],
  snp: result.snparResult ?
    result.snparResult.resistanceMutationIds || [] : [],
  matches: mergeMatches(result.paarResult, result.snparResult),
});
