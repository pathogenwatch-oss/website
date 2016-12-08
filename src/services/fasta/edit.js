const Assembly = require('data/assembly');
const { getCountryCode } = require('models/assemblyMetadata');

function updateAssemblyDocument(_id, { name, date, position, userDefined }) {
  const country = getCountryCode(position);
  return (
    Assembly.update({ _id }, { name, date, position, userDefined, country })
  );
}

module.exports = function ({ id, metadata }) {
  return (
    updateAssemblyDocument(id, metadata)
      .then(({ country }) => ({ country }))
  );
};
