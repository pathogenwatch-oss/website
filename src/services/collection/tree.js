const { request } = require('services');

module.exports = ({ user, uuid }) => {
  const projection = { tree: 1 };
  return request('collection', 'authorise', { user, uuid, projection })
    .then(collection => {
      const { status, newick } = collection.tree;
      return { status, newick };
    });
};
