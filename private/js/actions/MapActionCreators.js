var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {

  setAssemblyIds: function (assemblyIds) {

    console.log('Map assemblyIds:');
    console.dir(assemblyIds);

    var action = {
      type: 'set_assembly_ids',
      assemblyIds: assemblyIds
    };

    AppDispatcher.dispatch(action);
  }

};
