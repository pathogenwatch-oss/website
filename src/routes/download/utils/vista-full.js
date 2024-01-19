function formatMatches(matches) {
  return matches
    .map((match) => `${match.contigId}/${match.queryStart}-${match.queryEnd} reverse=${match.isForward} pid=${match.identity} complete=${match.isComplete} disrupted=${match.isDisrupted}`)
    .join(';');
}

module.exports.transformer = function (doc) {
  const record = {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: doc.analysis.vista.__v,
    Serogroup: doc.analysis.vista.serogroup,
    'Serogroup match': doc.analysis.vista.serogroupMarkers
      .filter((marker) => marker.matches.length !== 0)
      .map((marker) => `${marker.name}: ${marker.gene} ${formatMatches(marker.matches)}`).join("/ "),
  };

  doc.analysis.vista.virulenceGenes.forEach((geneRecord) => {
    record[geneRecord.name] = geneRecord.status;
    record[`${geneRecord.name} match`] = formatMatches(geneRecord.matches);
  });

  doc.analysis.vista.virulenceClusters.forEach((cluster) => {
    record[`${cluster.id} type`] = cluster.type;
    record[cluster.id] = cluster.status;
    record[`${cluster.id}  missing`] = cluster.missing;
    record[`${cluster.id}  incomplete`] = cluster.incomplete;
    Object.keys(cluster.matches).forEach((clusterGene) => {
      record[`${cluster.id} ${clusterGene}`] = formatMatches(cluster.matches[clusterGene].matches);
    });
  });

  return record;
};
