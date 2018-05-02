const Analysis = require('models/analysis');
const { ServiceRequestError } = require('utils/errors');
const { request } = require('services');

const taskNames = [
  'speciator', 'metrics', 'mlst', 'paarsnp', 'genotyphi', 'ngmast', 'core',
];

const projection = {
  _user: 1,
  _session: 1,
  binned: 1,
  country: 1,
  createdAt: 1,
  date: 1,
  day: 1,
  fileId: 1,
  month: 1,
  name: 1,
  pmid: 1,
  population: 1,
  public: 1,
  reference: 1,
  userDefined: 1,
  year: 1,
  'analysis.metrics': 1,
  'analysis.speciator': 1,
  'analysis.genotyphi': 1,
  'analysis.ngmast': 1,
  'analysis.mlst.__v': 1,
  'analysis.mlst.st': 1,
  'analysis.mlst.url': 1,
  'analysis.mlst.alleles': 1,
  'analysis.core.__v': 1,
  'analysis.core.summary': 1,
  'analysis.core.fp': 1,
  'analysis.paarsnp.__v': 1,
  'analysis.paarsnp.antibiotics': 1,
  'analysis.paarsnp.paar': 1,
  'analysis.paarsnp.snp': 1,
};

module.exports = ({ user, sessionID, id }) => {
  if (!id) throw new ServiceRequestError('Missing Id');

  return request('genome', 'authorise', { user, sessionID, id, projection });

  // TODO: Removed until task version switching is implemented on front-end

    // .then(genome =>
    //   Analysis.find(
    //     { fileId: genome.fileId, task: { $in: taskNames } },
    //     { _id: 0, task: 1, version: 1 }
    //   )
    //   .lean()
    //   .then(tasks => Object.assign(genome, { tasks }))
    // );
};
