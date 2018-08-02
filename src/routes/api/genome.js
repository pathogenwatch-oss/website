const express = require('express');
const zlib = require('zlib');
const contentLength = require('express-content-length-validator');

const services = require('services');

const router = express.Router();
const LOGGER = require('utils/logging').createLogger('Upload');

const config = require('configuration');

router.get('/genome/summary', (req, res, next) => {
  LOGGER.info('Received request to get genome summary');

  const { user, query } = req;
  Promise.all([
    services.request('genome', 'summary', { user, query }),
    services.request('genome', 'fetch-list', { user, query }),
  ])
    .then(([ summary, genomes ]) => res.json({ summary, genomes }))
    .catch(next);
});

router.get('/genome/stats', (req, res, next) => {
  LOGGER.info('Received request to get genome stats data');

  const { user, query } = req;
  services.request('genome', 'fetch-stats', { user, query })
    .then(response => res.json(response))
    .catch(next);
});

router.get('/genome/map', (req, res, next) => {
  LOGGER.info('Received request to get genome marker data');

  const { user, query } = req;
  services.request('genome', 'fetch-map', { user, query })
    .then(response => res.json(response))
    .catch(next);
});

router.get('/genome/:id', (req, res, next) => {
  const { user, params } = req;
  const { id } = params;

  LOGGER.info(`Received request to get single genome ${id}`);
  services.request('genome', 'fetch-one', { user, id })
    .then(response => res.json(response))
    .catch(next);
});

router.get('/genome/:id/clusters', (req, res, next) => {
  const { user, params } = req;
  const { id } = params;

  LOGGER.info(`Received request to get clusters for genome ${id}`);
  services.request('genome', 'fetch-clusters', { user, id })
    .then(response => res.json(response))
    .catch(next);
});

router.post('/genome/:id/clusters', async (req, res, next) => {
  const { user, params, body } = req;
  const { id } = params;
  const { clientId } = body;

  LOGGER.info('Received request to run clustering for genome', id);

  try {
    const response = await services.request('clustering', 'submit', { user, genomeId: id, clientId });
    res.json(response);
  } catch (e) {
    const { msg } = e;
    if (msg.indexOf('Already queued this job') !== -1) {
      res.status(304);
      res.json({ ok: 1 });
    } else {
      next(e);
    }
  }
});

router.post('/genome/:id/clusters/edges', async (req, res, next) => {
  const { user, body } = req;
  const { threshold, sts, version, scheme } = body;
  const { id } = req.params;

  LOGGER.info('Received request for cluster edges', id);

  try {
    const response = await services.request('clustering', 'fetch-edges', { user, genomeId: id, threshold, sts, version, scheme });
    const { edges = [] } = response;
    if (edges.length <= 0) throw new NotFoundError(`No cluster edges found for ${id} at threshold ${threshold}`);
    res.json(response);
  } catch (e) {
    next(e);
  }
});


router.get('/genome', (req, res, next) => {
  LOGGER.info('Received request to get genomes');

  const { user, query } = req;
  services.request('genome', 'fetch-list', { user, query }).
    then(response => res.json(response)).
    catch(next);
});

function getStream(req) {
  if (req.headers['content-type'] === 'application/zip') {
    return req.pipe(zlib.createInflate());
  }
  return req;
}

router.put(
  '/genome',
  contentLength.validateMax({ max: (config.maxGenomeFileSize || 10) * 1048576 }),
  (req, res, next) => {
    LOGGER.info('Received request to create genome');

    const { user } = req;
    const { name, uploadedAt, clientId } = req.query;

    services.request('genome', 'create', {
      timeout$: 1000 * 60 * 5,
      stream: getStream(req),
      metadata: { name, uploadedAt },
      user,
      clientId,
    })
    .then(response => res.json(response))
    .catch(next);
  }
);

router.post('/genome/selection', (req, res, next) => {
  LOGGER.info('Received request to get selection');
  const { user } = req;
  const ids = req.body;
  services.request('genome', 'selection', { user, ids })
    .then(response => res.json(response))
    .catch(next);
});

router.post('/genome/bin', (req, res, next) => {
  const { user, body } = req;
  const { status, ids } = body;

  LOGGER.info('Received request to bin genomes.');

  services.request('genome', 'bin', { ids, user, status })
    .then(response => res.json(response))
    .catch(next);
});

router.post('/genome/:id', (req, res, next) => {
  LOGGER.info('Received request to edit genome');

  const { id } = req.params;
  const { body, user } = req;
  services.request('genome', 'edit', { id, user, metadata: body })
    .then(response => res.json(response))
    .catch(next);
});

router.get('/upload/:uploadedAt/position', (req, res, next) => {
  LOGGER.info('Received request to get upload position');
  const { uploadedAt } = req.params;
  services.request('tasks', 'queue-position', { uploadedAt })
    .then(result => res.json(result))
    .catch(next);
});

router.get('/upload/:uploadedAt', (req, res, next) => {
  LOGGER.info('Received request to get upload session');
  const { user } = req;
  const { uploadedAt } = req.params;
  Promise.all([
    services.request('genome', 'fetch-upload', { user, query: { uploadedAt } }),
    services.request('tasks', 'queue-position', { uploadedAt }),
  ])
  .then(([ files, { position } ]) => res.json({ files, position }))
  .catch(next);
});

router.get('/upload', (req, res, next) => {
  LOGGER.info('Received request to get upload sessions');
  const { user } = req;
  services.request('genome', 'fetch-upload-list', { user })
    .then(response => res.json(response))
    .catch(next);
});

module.exports = router;
