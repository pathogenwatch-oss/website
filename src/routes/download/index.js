const express = require('express');
const csv = require('csv');
const router = express.Router();

const services = require('services');
const Genome = require('models/genome');

const LOGGER = require('utils/logging').createLogger('Downloads');

router.get('/file/:filename',
  (req, res, next) => {
    const { filename } = req.params;
    LOGGER.info(`Received request for file: ${filename}`);

    if (!req.query.filename) {
      res.status(400).send('`filename` query parameter is required.');
      return;
    }

    res.set({
      'Content-Disposition': `attachment; filename="${req.query.filename}.zip"`,
      'Content-type': 'application/zip',
    });

    services.request('download', 'get-file', { filename }).
      then(stream => {
        stream.on('error', error => next(error));

        stream.pipe(res);
      }).
      catch(next);
  }
);

function downloadAnalysisResults(ids, task, projection, transformer, options = {}, response) {
  const { header = true, quotedString = true, user, sessionID } = options;

  if (!ids || typeof(ids) !== 'string' || ids === '') {
    LOGGER.error('Missing ids');
    return response.sendStatus(400);
  }

  const query = Object.assign(
    { _id: { $in: ids.split(',') }, [`analysis.${task}`]: { $exists: true } },
    Genome.getPrefilterCondition({ user, sessionID })
  );
  const cursor = Genome.find(query, projection);
  const filename = `wgsa-${task}-${Date.now()}.csv`;

  response.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  response.setHeader('Content-Type', 'text/csv');

  return cursor
    .cursor()
    .pipe(csv.transform(transformer))
    .pipe(csv.stringify({ header, quotedString }))
    .pipe(response);
}

router.get('/analysis/:task', (req, res, next) => {
  const { ids } = req.query;
  if (!ids || typeof (ids) !== 'string' || ids === '') {
    LOGGER.error('Missing ids');
    return res.sendStatus(400);
  }
  return next();
});

router.get('/analysis/mlst', (req, res) => {
  const { user, sessionID, query } = req;
  const { ids } = query;
  const options = { user, sessionID };
  const task = 'mlst';
  const projection = {
    name: 1,
    'analysis.mlst.__v': 1,
    'analysis.mlst.st': 1,
    'analysis.mlst.alleles': 1,
  };
  const transformer = function (doc) {
    const result = {
      genomeId: doc._id.toString(),
      genomeName: doc.name,
      version: doc.analysis.mlst.__v,
      st: doc.analysis.mlst.st,
    };

    for (const { gene, hits } of doc.analysis.mlst.alleles) {
      result[gene] = hits.join(',');
    }

    return result;
  };
  downloadAnalysisResults(ids, task, projection, transformer, options, res);
});

router.get('/analysis/speciator', (req, res) => {
  const { user, sessionID } = req;
  const { ids } = req.query;
  const options = { user, sessionID };
  const task = 'speciator';
  const projection = { name: 1, 'analysis.speciator': 1 };
  const transformer = function (doc) {
    return {
      genomeId: doc._id.toString(),
      genomeName: doc.name,
      version: doc.analysis.speciator.__v,
      organismName: doc.analysis.speciator.organismName,
      organismId: doc.analysis.speciator.organismId,
      speciesName: doc.analysis.speciator.speciesName,
      speciesId: doc.analysis.speciator.speciesId,
      genusName: doc.analysis.speciator.genusName,
      genusId: doc.analysis.speciator.genusId,
      referenceId: doc.analysis.speciator.referenceId,
      matchingHashes: doc.analysis.speciator.matchingHashes,
      pValue: doc.analysis.speciator.pValue,
      mashDistance: doc.analysis.speciator.mashDistance,
    };
  };
  downloadAnalysisResults(ids, task, projection, transformer, options, res);
});

router.get('/analysis/paarsnp', (req, res) => {
  const { user, sessionID, query } = req;
  const { ids } = query;
  const options = { user, sessionID };
  const task = 'paarsnp';
  const projection = {
    name: 1,
    'analysis.paarsnp.__v': 1,
    'analysis.paarsnp.antibiotics': 1,
  };
  const transformer = function (doc) {
    const result = {
      genomeId: doc._id.toString(),
      genomeName: doc.name,
      version: doc.analysis.paarsnp.__v,
    };
    for (const { state, fullName } of doc.analysis.paarsnp.antibiotics) {
      result[fullName] = state;
    }
    return result;
  };
  downloadAnalysisResults(ids, task, projection, transformer, options, res);
});

router.get('/analysis/genotyphi', (req, res) => {
  const { user, sessionID, query } = req;
  const { ids } = query;
  const options = { user, sessionID };
  const task = 'genotyphi';
  const projection = {
    name: 1,
    'analysis.genotyphi.__v': 1,
    'analysis.genotyphi.genotype': 1,
    'analysis.genotyphi.foundLoci': 1,
  };
  const transformer = function (doc) {
    return {
      genomeId: doc._id.toString(),
      genomeName: doc.name,
      version: doc.analysis.genotyphi.__v,
      genotype: doc.analysis.genotyphi.genotype,
      snpsCalled: doc.analysis.genotyphi.foundLoci,
    };
  };
  downloadAnalysisResults(ids, task, projection, transformer, options, res);
});

router.get('/analysis/ngmast', (req, res) => {
  const { user, sessionID, query } = req;
  const { ids } = query;
  const options = { user, sessionID };
  const task = 'ngmast';
  const projection = {
    name: 1,
    'analysis.ngmast.__v': 1,
    'analysis.ngmast.ngmast': 1,
    'analysis.ngmast.por': 1,
    'analysis.ngmast.tbpb': 1,
  };
  const transformer = function (doc) {
    return {
      genomeId: doc._id.toString(),
      genomeName: doc.name,
      version: doc.analysis.ngmast.__v,
      ngmast: doc.analysis.ngmast.ngmast,
      por: doc.analysis.ngmast.por,
      tbpb: doc.analysis.ngmast.tbpb,
    };
  };
  downloadAnalysisResults(ids, task, projection, transformer, options, res);
});

router.get('/analysis/cgmlst', (req, res) => {
  const { user, sessionID, query } = req;
  const { ids } = query;
  const options = { user, sessionID };
  const task = 'cgmlst';
  const projection = {
    name: 1,
    'analysis.cgmlst.__v': 1,
    'analysis.cgmlst.st': 1,
    'analysis.cgmlst.matches': 1,
  };
  const transformer = function (doc, callback) {
    const result = [];
    for (const { gene, id, start, end, contig } of doc.analysis.cgmlst.matches) {
      result.push({
        genomeId: doc._id.toString(),
        genomeName: doc.name,
        version: doc.analysis.cgmlst.__v,
        gene,
        alleleId: id,
        start,
        end,
        contig,
        direction: start > end ? 'reverse' : 'forwards',
      });
    }
    callback(null, ...result);
  };
  downloadAnalysisResults(ids, task, projection, transformer, options, res);
});

router.use('/genome', require('./genome'));
router.use('/collection', require('./collection'));

module.exports = router;
