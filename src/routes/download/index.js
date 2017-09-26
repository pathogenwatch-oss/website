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

router.get('/genome/:id', (req, res, next) => {
  const { user, params, query, sessionID } = req;
  const { id } = params;
  const { type } = query;

  if (!id) {
    LOGGER.error('Missing id');
    return res.sendStatus(400);
  }

  LOGGER.info(`Received request for fasta: ${id}`);

  return services.request('genome', 'download', { user, sessionID, type, id }).
    then(({ filePath, fileName }) => {
      res.set({
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-type': 'text/plain',
      });
      return res.sendFile(filePath);
    }).
    catch(next);
});

router.get('/archive/:type', (req, res, next) => {
  const { user, sessionID } = req;
  const { type } = req.params;
  const { filename = 'wgsa-genomes.zip', ids } = req.query;

  if (!ids || !ids.length) return res.sendStatus(400);
  const splitIds = ids.split(',');

  LOGGER.info(`Received request for ${type} archive of ${splitIds.length} files`);

  return (
    services.request('download', 'fetch-genomes',
        { user, sessionID, type, ids: splitIds, projection: { name: 1, fileId: 1 } })
      .then(genomes =>
        services.request('download', 'create-genome-archive', { genomes }))
      .then(stream => {
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', 'application/zip');
        stream.pipe(res);
      })
      .catch(next)
  );
});

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
  const { ids, organismId } = req.query;
  if (!ids || typeof (ids) !== 'string' || ids === '') {
    LOGGER.error('Missing ids');
    return res.sendStatus(400);
  }
  if (!organismId || typeof (organismId) !== 'string' || organismId === '') {
    LOGGER.error('Missing Organism Id');
    return res.sendStatus(400);
  }
  next();
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
  const transformer = ({ _id, name, analysis }) => {
    const result = {
      id: _id.toString(),
      name,
      version: analysis.mlst.__v,
      st: analysis.mlst.st,
    };

    for (const { gene, hits } of analysis.mlst.alleles) {
      result[gene] = hits.join(',');
    }

    return result;
  };
  downloadAnalysisResults(ids, task, projection, transformer, options, res);
});

router.get('/analysis/speciator', (req, res) => {
  const { user, sessionID, query } = req;
  const { ids } = query;
  const options = { user, sessionID };
  const task = 'speciator';
  const projection = { name: 1, 'analysis.speciator': 1 };
  const transformer = ({ _id, name, analysis }) => ({
    id: _id.toString(),
    name,
    version: analysis.speciator.__v,
    organismName: analysis.speciator.organismName,
    organismId: analysis.speciator.organismId,
    speciesId: analysis.speciator.speciesId,
    genusId: analysis.speciator.genusId,
    referenceId: analysis.speciator.referenceId,
    matchingHashes: analysis.speciator.matchingHashes,
    pValue: analysis.speciator.pValue,
    mashDistance: analysis.speciator.mashDistance,
  });
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
  const transformer = ({ _id, name, analysis }) => {
    const doc = { id: _id.toString(), name, version: analysis.paarsnp.__v };
    for (const key of Object.keys(analysis.paarsnp.antibiotics)) {
      doc[key] = analysis.paarsnp.antibiotics[key].state;
    }
    return doc;
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
  const transformer = ({ _id, name, analysis }) => ({
    id: _id.toString(),
    name,
    version: analysis.genotyphi.__v,
    genotype: analysis.genotyphi.genotype,
    snpsCalled: analysis.genotyphi.foundLoci,
  });
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
  const transformer = ({ _id, name, analysis }) => ({
    id: _id.toString(),
    name,
    version: analysis.ngmast.__v,
    ngmast: analysis.ngmast.ngmast,
    por: analysis.ngmast.por,
    tbpb: analysis.ngmast.tbpb,
  });
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
  const transformer = ({ _id, name, analysis }, callback) => {
    const result = [];
    for (const { gene, id, start, end, contig } of analysis.cgmlst.matches) {
      result.push({
        id: _id.toString(),
        name,
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

router.get('/annotations', require('./annotations'));

module.exports = router;
