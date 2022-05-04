const { enqueue } = require('models/queue');
const User = require('models/user');
const { getCollectionTask } = require('../../manifest');

module.exports = async function ({ organismId, collectionId, clientId, userId }) {
  const user = await User.findById(userId, { flags: 1 });
  const spec = getCollectionTask(organismId, 'tree', user);
  return enqueue(
    {
      spec,
      metadata: {
        organismId,
        collectionId,
        clientId,
        name: 'collection',
      },
    });
};
