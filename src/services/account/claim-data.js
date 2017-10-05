const Genome = require('models/genome');
const Collection = require('models/collection');

function claimGenomes(_user, _session) {
  if (!_user || !_session) return Promise.resolve();

  return Genome.update(
    {
      _session,
      _user: { $exists: false },
    },
    {
      $set: { _user },
      $unset: { _session: 1 },
    },
    {
      multi: true,
    }
  );
}

function claimCollections(_user, _session) {
  if (!_user || !_session) return Promise.resolve();

  return Collection.update(
    {
      _session,
      _user: { $exists: false },
    },
    {
      $set: { _user },
      $unset: { _session: 1 },
    },
    {
      multi: true,
    }
  );
}

module.exports = ({ user, session }) => (
  Promise.all([
    claimGenomes(user, session),
    claimCollections(user, session),
  ])
);
