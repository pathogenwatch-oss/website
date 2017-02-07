export const getCollections = ({ collections }) =>
  Object.keys(collections.entities).map(key => collections.entities[key]);

export const getTotalCollections =
  state => getCollections(state).length;
