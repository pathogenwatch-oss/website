const User = require('models/user');

function getFlagsForUser(user) {
  const flags = user.flags || {};
  return {
    showKlebExperiment() {
      return flags.KLEB_EXPERIMENT_USER && true;
    },
  };
}

async function getFlagsForUserId(userId) {
  const user = await User.findById(userId, { flags: 1 });
  return getFlagsForUser(user);
}

module.exports = {
  getFlagsForUser,
  getFlagsForUserId,
};
