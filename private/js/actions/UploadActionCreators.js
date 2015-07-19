var AppDispatcher = require('../dispatcher/AppDispatcher');
var FileUtils = require('../utils/File');

module.exports = {

  addFiles: function (files) {
    var startProcessingFilesAction = {
      type: 'start_processing_files'
    };

    AppDispatcher.dispatch(startProcessingFilesAction);

    FileUtils.parseFiles(files, function iife(error, rawFiles, assemblies) {
      console.log('[Macroreact dev] rawFiles:');
      console.dir(rawFiles);

      console.log('[Macroreact dev] assemblies:');
      console.dir(assemblies);

      var finishProcessingFilesAction = {
        type: 'finish_processing_files'
      };

      var addFilesAction = {
        type: 'add_files',
        rawFiles: rawFiles,
        assemblies: assemblies
      };

      AppDispatcher.dispatch(finishProcessingFilesAction);
      AppDispatcher.dispatch(addFilesAction);
    });
  }
};
