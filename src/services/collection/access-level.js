const Collection = require('models/collection');

const { request } = require('services');
const { ServiceRequestError } = require('utils/errors');

module.exports = async function ({ user, token, access }) {
  if (!user || !token || !access) {
    return new ServiceRequestError('Missing params');
  }

  request('collection', 'authorise', { user, token, projection: { _id: 1 } });

  const response = await Collection.update(
    { token, _user: user._id },
    { $set: { access } }
  );

  if (response.ok !== 1) throw new ServiceRequestError('Failed to complete access level change');
  return { ok: 1 };
};
