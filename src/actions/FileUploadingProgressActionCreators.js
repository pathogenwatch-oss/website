import AppDispatcher from '../dispatcher/AppDispatcher';

export default {

  setAssemblyProgress(assemblyId, progress) {
    AppDispatcher.dispatch({
      type: 'set_assembly_progress',
      assemblyId,
      progress,
    });
  },

};
