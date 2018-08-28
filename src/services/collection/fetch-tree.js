const { request } = require('services');

module.exports = ({ user, token }) => {
  const projection = { tree: 1 };
  return request('collection', 'authorise', { user, token, projection })
    .then(collection => {
      const { status, newick } = collection.tree;
      return { status, newick };
    });
};
