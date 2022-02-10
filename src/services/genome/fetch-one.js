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
  assembler: 1,
  'analysis.cgmlst.scheme': 1,
  'analysis.core.__v': 1,
  'analysis.core.fp': 1,
  'analysis.core.summary': 1,
  'analysis.genotyphi': 1,
  'analysis.inctyper': 1,
  'analysis.kaptive': 1,
  'analysis.kleborate': 1,
  'analysis.metrics': 1,
  'analysis.mlst.__v': 1,
  'analysis.mlst.alleles': 1,
  'analysis.mlst.st': 1,
  'analysis.mlst.url': 1,
  'analysis.mlst2.__v': 1,
  'analysis.mlst2.alleles': 1,
  'analysis.mlst2.st': 1,
  'analysis.mlst2.url': 1,
  'analysis.ngmast': 1,
  'analysis.ngono-markers.__v': 1,
  'analysis.ngono-markers.status': 1,
  'analysis.ngstar.__v': 1,
  'analysis.ngstar.alleles': 1,
  'analysis.ngstar.st': 1,
  'analysis.ngstar.url': 1,
  'analysis.paarsnp.__v': 1,
  'analysis.paarsnp.resistanceProfile': 1,
  'analysis.paarsnp.library': 1,
  'analysis.paarsnp.matches': 1,
  'analysis.pangolin': 1,
  'analysis.poppunk2.strain': 1,
  'analysis.sarscov2-variants': 1,
  'analysis.serotype': 1,
  'analysis.speciator': 1,
  'analysis.spn_pbp_amr': 1,
  'analysis.vista': 1,
  'upload.type': 1,
};

module.exports = ({ user, id, collectionId }) => {
  if (!id) throw new ServiceRequestError('Missing Id');

  return request('genome', 'authorise', { user, id, collectionId, projection });
};
