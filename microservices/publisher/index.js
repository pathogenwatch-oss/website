const argv = require('named-argv');

const services = require('services');

const {
  collectionId,
  organismId,
} = argv.opts;

console.log({ collectionId, organismId });

if (!collectionId || !organismId) {
  console.log('Missing arguments');
  process.exit(1);
}

module.exports = function () {
  services.request('backend', 'publish', { organismId, collectionId })
    .then(() => process.exit())
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
};
