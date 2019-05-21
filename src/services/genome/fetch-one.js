// const Analysis = require('models/analysis');
const { ServiceRequestError } = require('utils/errors');
const { request } = require('services');

const projection = {
  _user: 1,
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
  'analysis.cgmlst.scheme': 1,
  'analysis.core.__v': 1,
  'analysis.core.fp': 1,
  'analysis.core.summary': 1,
  'analysis.genotyphi': 1,
  'analysis.inctyper': 1,
  'analysis.kleborate': 1,
  'analysis.metrics': 1,
  'analysis.mlst.__v': 1,
  'analysis.mlst.alleles': 1,
  'analysis.mlst.st': 1,
  'analysis.mlst.url': 1,
  'analysis.ngmast': 1,
  'analysis.paarsnp.__v': 1,
  'analysis.paarsnp.antibiotics': 1,
  'analysis.paarsnp.paar': 1,
  'analysis.paarsnp.snp': 1,
  'analysis.paarsnp.library': 1,
  'analysis.paarsnp.matches': 1,
  'analysis.poppunk.strain': 1,
  'analysis.serotype': 1,
  'analysis.speciator': 1,
  'upload.type': 1,
};

// const taskNames = [
//   'speciator', 'metrics', 'mlst', 'paarsnp', 'genotyphi', 'ngmast', 'core',
// ];

module.exports = async ({ user, id }) => {
  if (!id) throw new ServiceRequestError('Missing Id');

  const genome = await request('genome', 'authorise', { user, id, projection });

  // TODO: Add task versions back when version-switching added to front-end
  // TODO: Check if there are any relevant flags which disable tasks.
  return genome;
  // const promises = [
  // Analysis.find(
  //   { fileId: genome.fileId, task: { $in: taskNames } },
  //   { _id: 0, task: 1, version: 1 }
  // ).lean(),
  // ];

  // const [ /* tasks,*/ clustering = null ] = await Promise.all(promises);

  // return Object.assign(genome, { tasks });
};
