const express = require("express");
const contentLength = require('express-content-length-validator');
const services = require('services');
const LOGGER = require('utils/logging').createLogger('Genome');
const config = require('configuration');
const { asyncWrapper } = require("utils/routes");
const zlib = require("zlib");
const { ObjectId } = require("mongoose/lib/types");

const router = express.Router();

function getStream(req) {
  if (req.headers['content-type'] === 'application/zip') {
    return req.pipe(zlib.createInflate());
  }
  return req;
}

router.get('/experimental', (req, res, next) => {
  LOGGER.info(`Test`);
  res.sendStatus(200);
  next();
});

router.post('/experimental/initialise', (req, res, next) => {
  LOGGER.info('Received request to create EW record');
  const { token, name, metadata } = req.body;
  if (!token || token !== config.ew.token) {
    res.sendStatus(401);
    return;
  }

  const uploadedAt = new Date().toISOString();
  const data = [ {
    id: config.ew.clientId,
    metadata: { name, type: 'assembly', files: `${name}.fasta`, ...metadata }
  } ];
  services.request('genome', 'initialise', {
    user: { _id: config.ew.userId },
    data,
    uploadedAt,
  }).then(idMap => {
    res.json({ ok: 1, id: Object.values(idMap)[0].toString() });
  })
    .catch(next);
});

router.put(
  '/experimental/:id/upload',
  contentLength.validateMax({ max: (config.maxGenomeFileSize || 10) * 1048576 }),
  asyncWrapper(async (req, res, next) => {
    LOGGER.info('Received request for EW upload');
    const { id } = req.params;
    const { token } = req.query;

    if (!token || token !== config.ew.token) {
      res.sendStatus(401);
      return;
    }
    LOGGER.info(`Received request for EW upload of ${id}`);

    services
      .request('genome', 'upload', {
        timeout$: 1000 * 60 * 5,
        stream: getStream(req),
        id,
        userId: ObjectId(config.ew.userId),
        clientId: config.ew.clientId,
      })
      .then(() => res.json({ ok: 1 }))
      .catch(next);
  })
);

router.get('/experimental/:id', asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { token } = req.query;
  LOGGER.info(`Received request to get single genome ${id}`);
  if (!token || token !== config.ew.token) {
    res.sendStatus(401);
    return;
  }
  const query = { _id: id };
  const { genomes: [ genome ] } = await services.request('genome', 'fetch-upload', {
    user: { _id: config.ew.userId },
    query,
  });

  if (genome === undefined) {
    res.sendStatus(404);
    return;
  }

  const result = {
    status: 'FAILED',
    genome: genome.id.toString(),
    name: genome.name || '',
    analysis: {},
    errored: genome.errored || [],
  };

  if (genome.pending.length > 0 || ((!!genome.analysis || Object.keys(genome).length === 0) && 'errored' in Object.keys(genome) && genome.errored.length === 0)) {
    result.status = 'PENDING';
    res.json(result);
    return;
  }

  if (!('analysis' in Object.keys(genome)) && 'errored' in Object.keys(genome) && genome.errored.length > 0) {
    res.json(result);
    return;
  }

  // const genomeData = await services.request('genome', 'fetch-one', {
  //   user: { _id: config.ew.userId },
  //   id,
  //   collectionId: null,
  // });

  result.analysis = genome.analysis;
  result.status = 'OK';
  res.json(result);

  // services
  //   .request('genome', 'fetch-one', { user: { _id: config.ew.userId }, id, collectionId: null })
  //   .then((response) => res.json(response))
  //   .catch(next);
}));

module.exports = router;
