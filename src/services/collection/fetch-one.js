const Genome = require('models/genome');

const { request } = require('services');

const projection = {
  country: 1,
  createdAt: 1,
  year: 1,
  month: 1,
  day: 1,
  name: 1,
  pmid: 1,
  userDefined: 1,
  latitude: 1,
  longitude: 1,
  'analysis.metrics': 1,
  'analysis.genotyphi': 1,
  'analysis.ngmast': 1,
  'analysis.core.fp.subTypeAssignment': 1,
  'analysis.core.coreSummary': 1,
  'analysis.mlst.st': 1,
  'analysis.mlst.alleles': 1,
  'analysis.paarsnp.antibiotics': 1,
  'analysis.paarsnp.paar': 1,
  'analysis.paarsnp.snp': 1,
};

function getGenomes(collection) {
  return Genome.find({ _id: { $in: collection.genomes } }, projection)
    .lean()
    .then(genomes => genomes.map(doc => Object.assign(doc, { uuid: doc._id })));
}

module.exports = ({ user, uuid }) =>
  request('collection', 'authenticate', { user, uuid })
    .then(collection =>
      collection
        .populate('_organism')
        .execPopulate()
        .then(getGenomes)
        .then(genomes => {
          const doc = collection.toObject();
          doc.genomes = genomes;
          doc.status = 'READY';
          return doc;
        })
    );
