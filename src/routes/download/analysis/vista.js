const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');

function format_matches(matches) {
  return matches
    .map(match => `${match.contigId}/${match.queryStart}-${match.queryEnd} reverse=${match.isForward} pid=${match.identity} complete=${match.isComplete} disrupted=${match.isDisrupted}`)
    .join(';')
}

const transformer = function (doc) {
  const record = {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    'Version': doc.analysis.vista.__v,
    'Biotype': doc.analysis.vista.biotype,
    'Biotype match': doc.analysis.vista.biotypeMarkers
      .filter(marker => marker.matches.length !== 0)
      .map(marker => `${marker.name}: ${marker.gene} ${format_matches(marker.matches)}`).join("/ "),
    'Serogroup': doc.analysis.vista.serogroup,
    'Serogroup match': doc.analysis.vista.serogroupMarkers
      .filter(marker => marker.matches.length !== 0)
      .map(marker => `${marker.name}: ${marker.gene} ${format_matches(marker.matches)}`).join("/ "),
  };

  doc.analysis.vista.virulenceGenes.forEach(geneRecord => {
      record[geneRecord.name] = geneRecord.status;
      record[`${geneRecord.name} match`] = format_matches(geneRecord.matches);
    }
  );

  doc.analysis.vista.virulenceClusters.forEach(cluster => {
    record[cluster.id] = cluster.complete ? 'Present' : 'Incomplete';
    record[`${cluster.id} type`] = cluster.type;
    record[`${cluster.id}  missing`] = cluster.missing;
    record[`${cluster.id}  incomplete`] = cluster.incomplete;
    Object.keys(cluster.matches).forEach(clusterGene => {
      record[`${cluster.id} ${clusterGene}`] = format_matches(cluster.matches[clusterGene].matches)
    })
  });

  return record;
};

module.exports = (req, res) => {
  const { user } = req;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'vista.csv';
  const { ids } = req.body;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/csv');

  const query = Object.assign(
    { _id: { $in: ids.split(',') }, 'analysis.vista': { $exists: true } },
    Genome.getPrefilterCondition({ user })
  );
  const projection = {
    name: 1,
    'analysis.vista': 1,
  };

  return Genome.find(query, projection)
    .cursor()
    .pipe(csv.transform(transformer))
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(res);
};
