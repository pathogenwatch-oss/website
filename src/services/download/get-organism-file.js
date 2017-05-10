const fs = require('fs');
const path = require('path');
const sanitize = require('sanitize-filename');

const config = require('configuration.js');
const downloads = require('utils/organismDownloads');
const organisms = require('wgsa-front-end/universal/organisms');

const { ServiceRequestError } = require('utils/errors');

const organismIds = organisms.reduce((memo, { nickname, id }) => {
  memo[nickname] = id;
  return memo;
}, {});

module.exports = function ({ nickname, type }) {
  if (!(nickname in organismIds)) {
    throw new ServiceRequestError('Unrecognised organism nickname');
  }
  if (!(type in downloads)) {
    throw new ServiceRequestError('Unrecognised organism download');
  }

  const { fileOnDisk } = downloads[type];
  const organismId = organismIds[nickname];
  const filename = fileOnDisk(organismId);

  return fs.createReadStream(
    path.join(
      config.downloadFileLocation, sanitize(organismId), sanitize(filename)
    )
  );
};
