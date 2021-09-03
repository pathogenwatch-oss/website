const LOGGER = require('utils/logging').createLogger('runner');
const readline = require('readline');
const { Readable, Writable, finished } = require('stream');

const { getImageName } = require('manifest.js');
const { tasks } = require('configuration.js');

const { username = 'anon', password = '' } = tasks.registry || {};

const Docker = require('dockerode');

const docker = new Docker();
const pLimit = require('p-limit');

const pullLimiter = pLimit(5);

class PullProgress extends Writable {
  constructor({ shortName, ...options }) {
    super(options);
    this.shortName = shortName;
    this.lastPerc = {};
  }

  _write(line, _, done) {
    const { status, progressDetail = {}, id } = JSON.parse(line);
    const { current = 0, total } = progressDetail;
    if (total === undefined) return done();
    const key = `${id}:${status}`;

    const perc = Math.floor(100 * current / total);
    const threshold = (this.lastPerc[key] || -1) + 5;
    if (perc > threshold) {
      const summary = `docker-pull:${this.shortName}:${key}:${perc}%`;
      LOGGER.info(summary);
      this.lastPerc[key] = perc;
    }
    return done();
  }
}

function pullImage(name) {
  const parts = name.split('/');
  const shortName = parts[parts.length - 1];
  return new Promise((resolve, reject) => {
    LOGGER.info(`Pulling image ${name}`);
    docker.pull(name, { authconfig: { username, password } }, (err, stream) => {
      if (err) return reject(err);
      const lines = readline.createInterface({
        input: stream,
        crlfDelay: Infinity,
      });
      const logger = new PullProgress({
        objectMode: true,
        shortName,
      });

      finished(logger, (err) => {
        if (err) return reject(err);
        return resolve();
      });

      Readable.from(lines).pipe(logger);
    });
  });
}

const cached = {};
const populatedCache = docker.listImages().then((images) => {
  for (const image of images) {
    const tags = image.RepoTags || [];
    for (const tag of tags) cached[tag] = Promise.resolve();
  }
});

module.exports = async function ({ task, version }) {
  await populatedCache;
  const name = getImageName(task, version);
  if (cached[name]) return cached[name];
  cached[name] = pullLimiter(() => pullImage(name));
  cached[name].then(() => LOGGER.info(`Pulled task=${task} version=${version}`));
  return cached[name];
};
