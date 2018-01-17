const { request } = require('services');

module.exports = ({ user, id }) => {
  const projection = { tree: 1 };
  return request('collection', 'authorise', { user, id, projection })
    .then(collection => {
      const { status, newick } = collection.tree;
      return { status, newick };
    });
};
