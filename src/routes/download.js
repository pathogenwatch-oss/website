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

router.put('/genome-archive', (req, res, next) => {
  const { user, sessionID } = req;
  const { type, ids } = req.body;

  LOGGER.info(`Received request for ${type} archive of ${ids.length} files`);

  return services.request('download', 'create-genome-archive', { user, sessionID, type, ids })
    .then(fileId => res.json({ fileId }))
    .catch(next);
});

router.get('/genome-archive/:id', (req, res, next) => {
  const { user, sessionID } = req;
  const { id } = req.params;
  const { filename } = req.query;

  LOGGER.info(`Received request for fasta archive: ${id} ${filename}`);

  services.request('download', 'genome-archive-path', { id, user, sessionID })
    .then(archivePath =>
      res.set({
        'Content-Disposition': `attachment;${filename ? ` filename="${filename}.zip"` : ''}`,
        'Content-type': 'application/zip',
      })
      .sendFile(archivePath)
    )
    .catch(next);
});

function downloadAnalysisResults(ids, task, projection, transformer, options = {}, response) {
  const { header = true, quotedString = true } = options;

  if (!ids || typeof(ids) !== 'string' || ids === '') {
    LOGGER.error('Missing ids');
    return response.sendStatus(400);
  }

  const query = {
    _id: { $in: ids.split(' ') },
    [`analysis.${task}`]: { $exists: true },
  };
  const cursor = Genome.find(query, projection);

  response.setHeader('Content-disposition', `attachment; filename=${task.csv}`);
  response.writeHead(200, { 'Content-Type': 'text/csv' });
  response.flushHeaders();

  return cursor
    .cursor()
    .pipe(csv.transform(transformer))
    .pipe(csv.stringify({ header, quotedString }))
    .pipe(response);
}

router.get('/analysis/mlst', (req, res) => {
  const options = req.query;
  const { ids } = options;
  const task = 'mlst';
  const projection = {
    name: 1,
    'analysis.mlst.__v': 1,
    'analysis.mlst.st': 1,
    'analysis.mlst.code': 1,
  };
  const transformer = ({ _id, name, analysis }) => ({
    id: _id.toString(),
    name,
    version: analysis.mlst.__v,
    st: analysis.mlst.st,
    code: analysis.mlst.code,
  });
  downloadAnalysisResults(ids, task, projection, transformer, options, res);
});

module.exports = router;
