module.exports.transformer = function (doc) {
  const record = {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    'Version': doc.analysis.vista.__v
  };

  doc.analysis.vista.virulenceGenes.forEach(gene => {
    record[gene.name] = gene.status;
  });

  doc.analysis.vista.virulenceClusters.forEach(cluster => {
    record[cluster.name] = cluster.complete ? 'Present' : cluster.present.length === 0 ? 'Not Found' : 'Partial';
  });

  return record;
};
