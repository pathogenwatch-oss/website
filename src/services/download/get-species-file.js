const fs = require('fs');
const path = require('path');
const sanitize = require('sanitize-filename');

const config = require('configuration.js');
const downloads = require('utils/speciesDownloads');
const species = require('wgsa-front-end/universal/species');

const { ServiceRequestError } = require('utils/errors');

const speciesIds = species.reduce((memo, { nickname, id }) => {
  memo[nickname] = id;
  return memo;
}, {});

module.exports = function ({ nickname, type }) {
  if (!(nickname in speciesIds)) {
    throw new ServiceRequestError('Unrecognised species nickname');
  }
  if (!(type in downloads)) {
    throw new ServiceRequestError('Unrecognised species download');
  }

  const { fileOnDisk } = downloads[type];
  const speciesId = speciesIds[nickname];
  const filename = fileOnDisk(speciesId);

  return fs.createReadStream(
    path.join(
      config.downloadFileLocation, sanitize(speciesId), sanitize(filename)
    )
  );
};
